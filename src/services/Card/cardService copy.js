//cardService.js

import { ref } from 'vue'
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  setDoc,
  query,
  orderBy,
  limit,
  startAfter
} from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { userData } from '../User/userDataService'
import { getUserData } from '../User/userGetData'
import { updateUser } from '../User/userUpdateService'

const db = getFirestore()
const getUserId = () => {
  const auth = getAuth()
  return auth.currentUser ? auth.currentUser.uid : null
}

export const cards = ref([])

export let lastVisible = ref([])

export let hasMoreCards = ref(true)

export const initializeCardListener = async () => {
  const cardsCollection = collection(db, 'cards')
  const q = query(
    cardsCollection,
    orderBy('updatedAt', 'desc'),
    orderBy('createdAt', 'desc'),
    limit(12)
  )
  const unsubscribe = onSnapshot(q, (snapshot) => {
    cards.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    lastVisible.value = snapshot.docs[snapshot.docs.length - 1]
  })
  return unsubscribe
}

const getCardDocRef = (uid) => doc(db, 'cards', uid)

const getCardData = async (uid) => {
  try {
    const cardDocRef = await getDoc(getCardDocRef(uid))
    if (cardDocRef.exists()) {
      return cardDocRef.data()
    } else {
      console.error('Card document does not exist')
      return null
    }
  } catch (error) {
    console.error('Error loading card data:', error)
    return null
  }
}

const updateCard = async (uid, data) => {
  try {
    const cardDocRef = getCardDocRef(uid)
    await setDoc(cardDocRef, data, { merge: true })
    return await getCardData(uid)
  } catch (error) {
    console.error('Error updating card:', error)
    return null
  }
}

const toggleLike = async (card) => {
  const userId = getUserId()

  const cardData = await getCardData(card.id)

 /* Verificar si los datos de la tarjeta existen
    if (!cardData) {
    console.error('Card document does not exist')
    return null
  } */

  const likeCards = userData.likeCards || []
  const isCardLiked = likeCards.includes(card.id)
  const likedBy = cardData.likedBy || []
  const isUserLiked = likedBy.includes(userId)
  const updatedLikedBy = isUserLiked
  ? likedBy.filter((id) => id !== userId)
  : [...likedBy, userId]
  const updatedLikeCards = isCardLiked
  ? likeCards.filter((id) => id !== card.id)
  : [...likeCards, card.id]
  const likes = updatedLikedBy.length
  card.likes = likes

  try {
    // Comprobar si es necesario el await
    updateCard(card.id, { likedBy: updatedLikedBy, likes })
    updateUser(userId, { likeCards: updatedLikeCards })
    return await getCardData(card.id)
  } catch (error) {
    console.error('Error toggling like:', error)
    return null
  }
}

const toggleFavorite = async (card) => {

  const userId = getUserId()
  //const cardData = await getCardData(card.id) <== Creo que no es necesario

  const favoriteCards = userData.favoriteCards || []
  const isCardFavorite = favoriteCards.includes(card.id)

  const updatedFavoriteCards = isCardFavorite
    ? favoriteCards.filter((id) => id !== card.id)
    : [...favoriteCards, card.id]

  console.log(
    `User ${userData.fullName} ${
      isCardFavorite ? 'removed' : 'added'
    } the card ${isCardFavorite ? 'from' : 'to'} 'favorites'`
  )

  try {
    // Comprobar si es necesario el await
    updateUser(userId, { favoriteCards: updatedFavoriteCards }),
    updateCard(card.id, { isFavorite: !isCardFavorite })
    return await getUserData(userId)
  } catch (error) {
    console.error('Error toggling favorite:', error)
    return null
  }
}

const toggleFollow = async (card) => {
  const userId = getUserId();

  const cardUserId = card.createdBy;

  try {
    // Update card user's "followers" array
    const cardUserRef = doc(db, 'users', cardUserId);
    const cardUserDoc = await getDoc(cardUserRef);
    let cardUserFollowers = cardUserDoc.data().followers || [];
    const isFollowingCardUser = cardUserFollowers.includes(userId);
    cardUserFollowers = isFollowingCardUser
      ? cardUserFollowers.filter((id) => id !== userId)
      : [...cardUserFollowers, userId];
    await setDoc(cardUserRef, { followers: cardUserFollowers }, { merge: true });

    // Update current user's "following" array
    const currentUserRef = doc(db, 'users', userId);
    let currentUserFollowing = userData.following || [];
    const isCardUserFollowed = currentUserFollowing.includes(cardUserId);
    currentUserFollowing = isCardUserFollowed
      ? currentUserFollowing.filter((id) => id !== cardUserId)
      : [...currentUserFollowing, cardUserId];
    await setDoc(currentUserRef, { following: currentUserFollowing }, { merge: true });

    // Update card's "followers" count (if available)
    if (card.followers) {
      const updatedFollowersCount = isFollowingCardUser
        ? card.followers - 1
        : card.followers + 1;
      await updateCard(card.id, { followers: updatedFollowersCount });
    }

    /* return {
      isFollowing: !isFollowingCardUser,
      followersCount: updatedFollowersCount,
    }; */
    updateUser(userId, { following: currentUserFollowing });
    updateUser(cardUserId, { followers: cardUserFollowers });
    return await getUserData(userId);
  } catch (error) {
    console.error('Error toggling follow:', error);
    return null;
  }
};

export const loadMoreCards = async () => {
  if (lastVisible.value) {
    const q = query(
      collection(db, 'cards'),
      orderBy('updatedAt', 'desc'),
      orderBy('createdAt', 'desc'),
      startAfter(lastVisible.value),
      limit(12)
    )
    const snapshot = await getDocs(q)
    cards.value.push(...snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    lastVisible.value = snapshot.docs[snapshot.docs.length - 1]
  }
}

export { getCardData, updateCard, toggleLike, toggleFavorite, toggleFollow }
