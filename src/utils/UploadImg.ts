import { getDownloadURL, uploadBytes, ref } from "firebase/storage";
import { storage } from "../utils/firebase";
import { UploadFile } from "antd";

export const validateFileType = (
  { type }: UploadFile,
  allowedTypes?: string
) => {
  if (!allowedTypes) {
    return true;
  }
  if (type) {
    return allowedTypes.includes(type);
  }
};

export const validateFileSize = (file: UploadFile, size: number) => {
  if (file.originFileObj){
  if (file.originFileObj.size) {
    return file.originFileObj.size <= size*1024*1024;
  }} else if (file.size) {
    return file.size <= size*1024*1024;
  }
  return false;
}

export const uploadImage = async (tutorId: number, file: File | null, sectionName: string, index: number, handleChange: (url: string) => void) => {
  if (!file) {
    return;
  }

  //By creating a reference to a file, your app gains access to it.
  const imageRef = ref(storage, `${tutorId}/${sectionName}_${index}.${file.type.split('/')[1]}`);
  try {

    const uploadResult = await uploadBytes(imageRef, file)

    // Get the download URL
    const url = await getDownloadURL(uploadResult.ref);
    if (url) {
      handleChange(url);
    }
  } catch (error) {
    console.error(`Upload failed: ${error}`);
  }

}
export const uploadAvatar = async (userId: number, file: File | null, sectionName: string) => {
  if (!file) {
    return;
  }

  //By creating a reference to a file, your app gains access to it.
  const imageRef = ref(storage, `${userId}/${sectionName}`);
  try {

    const uploadResult = await uploadBytes(imageRef, file)

    // Get the download URL
    const url = await getDownloadURL(uploadResult.ref);
    return url;
  } catch (error) {
    console.error(`Upload failed: ${error}`);
  }

}

