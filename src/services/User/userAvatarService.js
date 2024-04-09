// userAvatarService.js

import { getStorage, ref as firebaseStorageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const uploadAvatar = async (user, avatarFile) => {
  if (!user || !avatarFile) {
    console.error('User or avatar file not provided');
    return null;
  }

  try {
    const storage = getStorage();
    const metadata = {
      contentType: avatarFile.type,
    };

    const storageRef = firebaseStorageRef(storage, `avatars/${user.email}`);
    const uploadTask = uploadBytesResumable(storageRef, avatarFile, metadata);

    await uploadTask;
    const downloadURL = await getDownloadURL(storageRef);

    console.log('Avatar uploaded successfully:', downloadURL);
    return downloadURL;
  } catch (error) {
    console.error('Error during avatar upload:', error);
    return null;
  }
};

export const getDefaultAvatarURL = async () => {
  try {
    const defaultAvatarRef = firebaseStorageRef(getStorage(), 'avatars/Avatar.svg');
    const defaultAvatarURL = await getDownloadURL(defaultAvatarRef);
    return defaultAvatarURL;
  } catch (error) {
    console.error('Error obtaining default avatar URL:', error);
    return null;
  }
};