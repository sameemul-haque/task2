import React, { useState } from 'react';
import { db, storage } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useDispatch } from 'react-redux';
import { addUser } from '../services/usersSlice';

const UserForm: React.FC = () => {
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const age = e.target.validity.valid ? e.target.value : e.target.value.replace(/[^0-9]/g,"");
        setAge(age);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image) { alert('Please select an image'); return; }
        if (!name || !age || !image) return;

        setLoading(true);
        const uniqueFileName = `${uuidv4()}-${image.name}`;
        const storageRef = ref(storage, `images/${uniqueFileName}`);
        try {
            await uploadBytes(storageRef, image);
            const imageUrl = await getDownloadURL(storageRef);
            const timestamp = Date.now();

            const docRef = await addDoc(collection(db, 'usersdata'), {
                name,
                age,
                image: imageUrl,
                timestamp,
            });

            dispatch(addUser({
                id: docRef.id,
                name,
                age,
                image: imageUrl,
                timestamp,
            }));

            setName('');
            setAge('');
            setImage(null);
            setImagePreview(null);
            alert('Data added');
        } catch (error) {
            console.error('Error: ', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 space-y-4 bg-white rounded">
            <div className="flex items-center justify-center">
                <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    // required
                />
                <label
                    htmlFor="file-input"
                    className="cursor-pointer flex items-center justify-center w-24 h-24 bg-gray-200 text-gray-500 hover:bg-gray-400 hover:text-gray-800 rounded-full transition-all ease-in overflow-hidden"
                >
                    {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="object-cover w-full md:w-80 lg:w-80 h-full" />
                    ) : (
                        <span className="text-center text-sm">Select Image</span>
                    )}
                </label>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full md:w-80 lg:w-80 p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Age</label>
                <input
                    type="text"
                    pattern="[0-9]*"
                    value={age}
                    onChange={handleAgeChange}
                    className="mt-1 block w-full md:w-80 lg:w-80 p-2 border border-gray-300 rounded"
                    required
                />
            </div>
            <button type="submit" className="w-full md:w-80 lg:w-80 py-2 px-4 bg-blue-600 hover:bg-blue-800 text-white font-semibold rounded outline-none">
                {loading ? "Loading..." : "Submit"}
            </button>
        </form>
    );
};

export default UserForm;