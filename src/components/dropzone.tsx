"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import crypto from "crypto";
import toast from "react-hot-toast";
import { FaInbox } from "react-icons/fa";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Download, Lock, Unlock, UploadCloud } from "lucide-react";

const HybridImageEncryption = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");
  const [encryptedImage, setEncryptedImage] = useState<string | null>(null);
  const [decryptedImage, setDecryptedImage] = useState<string | null>(null);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 1) {
      const file = acceptedFiles[0];
      if (!isFileTypeAllowed(file)) {
        toast.error("Accepted image file ( jpg, png, jpeg ).");
        return;
      }
      try {
        const dataURL = await readFileAsDataURL(file);
        setUploadedImage(dataURL);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error during image upload:", error);
      }
    }
  };
  const isFileTypeAllowed = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    return allowedTypes.includes(file.type);
  };
  const onDecryptClick = async () => {
    if (!uploadedImage || !password || isDecrypting) {
      if (!password) {
        toast.error("Please enter the password for decryption.");
      }
      return;
    }
    try {
      setIsDecrypting(true);
      const decryptedDataURL = await decryptImage(uploadedImage, password);
      setDecryptedImage(decryptedDataURL);
      toast.success("Image decrypted successfully.");
    } catch (error) {
      toast.error("Wrong password or not encrypted image.");
    } finally {
      setIsDecrypting(false);
    }
  };
  const onUploadEncryptedClick = async () => {
    if (!uploadedImage || !password || isEncrypting) {
      if (!password) {
        toast.error("Please enter the password for encryption.");
      }
      return;
    }
    try {
      setIsEncrypting(true);
      const encryptedDataURL = await encryptImage(uploadedImage, password);
      setEncryptedImage(encryptedDataURL);
      toast.success("Image encrypted successfully.");
    } catch (error) {
      console.error("Error during encryption:", error);
    } finally {
      setIsEncrypting(false);
    }
  };
  const onDownloadEncryptedClick = () => {
    if (encryptedImage) {
      const link = document.createElement("a");
      link.href = encryptedImage;
      link.download = "encrypted_image.png";
      link.click();
    }
  };
  const onDownloadDecryptedClick = () => {
    if (decryptedImage) {
      const link = document.createElement("a");
      link.href = decryptedImage;
      link.download = "decrypted_image.png";
      link.click();
    }
  };
  const onUploadAnotherFileClick = () => {
    setUploadedImage(null);
    setEncryptedImage(null);
    setDecryptedImage(null);
    setPassword("");
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const readFileAsDataURL = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Failed to read file as data URL"));
        }
      };
      reader.onerror = () => {
        reject(new Error("Error reading file as data URL"));
      };
      reader.readAsDataURL(file);
    });
  };
  const encryptImage = async (
    dataURL: string,
    password: string
  ): Promise<string> => {
    const originalBuffer = Buffer.from(dataURL.split(",")[1], "base64");
    const key = deriveKeyFromPassword(password);
    const cipher = crypto.createCipher("aes-128-ecb", key);
    const encryptedBuffer = Buffer.concat([
      cipher.update(originalBuffer),
      cipher.final(),
    ]);
    const encryptedDataURL = `data:image/jpeg;base64,${encryptedBuffer.toString(
      "base64"
    )}`;
    return encryptedDataURL;
  };
  const decryptImage = async (
    dataURL: string,
    password: string
  ): Promise<string> => {
    const originalBuffer = Buffer.from(dataURL.split(",")[1], "base64");
    const key = deriveKeyFromPassword(password);
    const decipher = crypto.createDecipher("aes-128-ecb", key);
    const decryptedBuffer = Buffer.concat([
      decipher.update(originalBuffer),
      decipher.final(),
    ]);
    const decryptedDataURL = `data:image/jpeg;base64,${decryptedBuffer.toString(
      "base64"
    )}`;
    return decryptedDataURL;
  };
  const deriveKeyFromPassword = (password: string): Buffer => {
    return crypto.createHash("sha256").update(password).digest();
  };
  return (
    <div>
      {!uploadedImage ? (
        <div
          {...getRootProps()}
          className="bg-gray-50 h-56 md:h-80 rounded-xl shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center"
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <div className="space-y-4 text-gray-500">
              <div className="flex justify-center">
                <FaInbox size={60} className="text-orange-600" />
              </div>
              <h3 className="text-center font-medium text-lg">
                Yes, drop it here...
              </h3>
            </div>
          ) : (
            <div className="space-y-4 text-gray-500">
              <div className="flex justify-center">
                <FaInbox size={60} className="text-orange-600" />
              </div>
              <h3 className="text-center font-medium text-lg">
                Click to upload, or drag and drop
              </h3>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-5">
          <div className="flex gap-2">
            {/* Original Image */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <Badge className="mb-3">Original</Badge>
              <Card className=" max-w-[500px] max-h-[500px]">
                <CardContent>
                  <div className="flex items-center justify-center">
                    <img
                      src={uploadedImage}
                      // alt="Uploaded Image"
                      className="max-w-full max-h-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Encrypted Image */}
            {encryptedImage && (
              <div className="flex-1">
                <Badge variant="success" className="mb-3 gap-1">
                  Encrypted <Lock className="w-2.5 h-2.5 mb-1" />
                </Badge>
                <Card className=" max-w-[500px] max-h-[500px]">
                  <CardContent className="flex items-center justify-center">
                    <img
                      src={encryptedImage}
                      // alt="Encrypted Image"
                      className="max-w-full max-h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
            {/* Decrypted Image */}
{decryptedImage && (
              <div className="flex-1">
                <Badge variant="success" className="mb-3 gap-1">
                  Decrypted <Unlock className="w-2.5 h-2.5 mb-1" />
                </Badge>
                <Card className=" max-w-[500px] max-h-[500px]">
                  <CardContent>
                    <img
                      src={decryptedImage}
                      // alt="Decrypted Image"
                      className="max-w-full max-h-full"
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          <div className="flex mt-10 justify-center">
            {uploadedImage && !decryptedImage && !encryptedImage && (
              <>
                <div className="flex items-center mr-2">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password..."
                  />
                </div>
                <Button
                  onClick={onDecryptClick}
                  className="mr-2 rounded-lg"
                  disabled={isDecrypting}
                >
                  {isDecrypting ? "Decrypting..." : "Decrypt Image"}
                </Button>
                <Button
                  onClick={onUploadEncryptedClick}
                  disabled={isEncrypting}
                  className=" rounded-lg"
                >
                  {isEncrypting ? "Encrypting..." : "Encrypt Image"}
                </Button>
              </>
            )}
            {decryptedImage && (
              <Button
                onClick={onDownloadDecryptedClick}
                variant="secondary"
                size="lg"
                className=" rounded-lg"
              >
                Download Image
                <Download className="w-4 h-4 ml-2 mb-1" />
              </Button>
            )}
            {encryptedImage && (
              <Button
                variant="secondary"
                onClick={onDownloadEncryptedClick}
                disabled={isEncrypting}
                size="lg"
                className=" rounded-lg"
              >
                Download Image
                <Download className="w-4 h-4 ml-2 mb-1" />
              </Button>
            )}
            {uploadedImage && decryptedImage && (
              <Button
                onClick={onUploadAnotherFileClick}
                size="lg"
                className="ml-2 rounded-lg"
              >
                Upload Another File
                <UploadCloud className="w-4 h-4 ml-2 mb-1" />
              </Button>
            )}
            {uploadedImage && encryptedImage && (
              <Button
                onClick={onUploadAnotherFileClick}
                size="lg"
                className="ml-2 rounded-lg"
              >
                Upload Another File{" "}
                <UploadCloud className="w-4 h-4 ml-2 mb-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridImageEncryption;

// import Dropzone from "react-dropzone";
// import { FaInbox } from "react-icons/fa";

// type Props = {};

// const DropZone = (props: Props) => {
//   return (
//     <>
//       <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
//         {({ getRootProps, getInputProps }) => (
//           <div>
//             <div
//               {...getRootProps()}
//               className="bg-gray-50 h-56 md:h-80 rounded-xl shadow-sm border-2 border-dashed cursor-pointer flex items-center justify-center"
//             >
//               <input {...getInputProps()} />
//               <div className="space-y-4 text-gray-500">
//                 <div className="flex justify-center">
//                   <FaInbox size={60} className="text-orange-600" />
//                 </div>
//                 <h3 className="text-center font-medium text-lg">
//                   Click to upload, or drag and drop
//                 </h3>
//               </div>
//             </div>
//           </div>
//         )}
//       </Dropzone>
//     </>
//   );
// };

// export default DropZone;
