import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { imageToBase64 } from '../utils/imageToBase64';
import {
  ChatAlt2Icon,
  LocationMarkerIcon,
  PhoneIcon,
  UserIcon,
} from '@heroicons/react/outline';

const AddWorker = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    image: '',
    category: '',
    name: '',
    description: '',
    location: '',
    phone: '',
  });

  const navigate = useNavigate();

  const uploadImage = async (e) => {
    const data = await imageToBase64(e.target.files[0]);

    setFormData((preve) => {
      return {
        ...preve,
        image: data,
      };
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setFormData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { category, location, description, name, phone } = formData;
    const isValid = category && location && description && name && phone;

    if (isValid) {
      try {
        const res = await fetch('/server/listing/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            userRef: currentUser._id,
          }),
        });

        const data = await res.json();
        setLoading(false);

        if (data.success === false) {
          console.log('Profesional añadido exitosamente!');
          setError(data.message);
        }
        navigate(`/listing/${data._id}`);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    }
  };

  return (
    <>
      <div className="min-h-full">
        <div className="lg:pl-64 flex flex-col flex-1">
          <main className="flex-1 pb-8 mt-8">
            <div className="">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
                <h4 className="text-lg leading-6 font-medium text-gray-900">
                  Añadir trabajador
                </h4>
                <form
                  onSubmit={handleSubmit}
                  className="divide-y divide-gray-200"
                >
                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-500 py-2"
                    >
                      Nombre
                    </label>
                    <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={handleOnChange}
                        value={formData.name}
                        required
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      />

                      <div className="ml-4 flex-shrink-0 py-2">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label
                      htmlFor="location"
                      className="text-sm font-medium text-gray-500 py-2"
                    >
                      Ubicación
                    </label>
                    <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        id="location"
                        name="location"
                        onChange={handleOnChange}
                        value={formData.location}
                        placeholder="Rosario"
                        required
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      />
                      <div className="ml-4 flex-shrink-0 py-2">
                        <LocationMarkerIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-500 py-2"
                    >
                      Teléfono
                    </label>
                    <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="number"
                        id="phone"
                        name="phone"
                        minLength={7}
                        onChange={handleOnChange}
                        value={formData.phone}
                        required
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      />

                      <div className="ml-4 flex-shrink-0 py-2">
                        <PhoneIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label
                      htmlFor="category"
                      className="text-sm font-medium text-gray-500 py-2"
                    >
                      Tipo de trabajo
                    </label>
                    <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <input
                        type="text"
                        id="category"
                        name="category"
                        onChange={handleOnChange}
                        value={formData.category}
                        placeholder="Jardinería, plomería, etc ..."
                        required
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      />
                      <div className="ml-4 flex-shrink-0 py-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6 text-gray-500"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-500 py-2"
                    >
                      Descripción
                    </label>
                    <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      <textarea
                        type="text"
                        id="description"
                        name="description"
                        onChange={handleOnChange}
                        value={formData.description}
                        rows={4}
                        maxLength="50"
                        placeholder="Todo tipo de trabajo relacionado a la jardinería de lunes a viernes de 10:00 a 18:00"
                        required
                        className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                      />
                      <div className="ml-4 flex-shrink-0 py-2">
                        <ChatAlt2Icon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                  </div>

                  <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <span className="text-sm font-medium text-gray-500 py-2">
                      Imagen
                    </span>
                    <div className="mt-1 sm:mt-0 sm:col-span-2">
                      <div className="flex items-center">
                        {formData.image ? (
                          <label htmlFor="image">
                            <img
                              src={formData.image}
                              className="h-12 w-12 rounded-full overflow-hidden bg-gray-200"
                              alt="profile image"
                            />
                            <input
                              type="file"
                              accept="image/*"
                              id="image"
                              name="image"
                              className="hidden"
                              onChange={uploadImage}
                            />
                          </label>
                        ) : (
                          <label
                            htmlFor="image"
                            className="h-12 w-12 rounded-full overflow-hidden bg-gray-200"
                          >
                            <svg
                              className="h-full w-full text-cyan-600"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            <input
                              type="file"
                              accept="image/*"
                              id="image"
                              name="image"
                              className="hidden"
                              onChange={uploadImage}
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="py-4 flex justify-center md:justify-end">
                    <button
                      disabled={loading}
                      className="ml-0 mt-2 md:mt-0 md:ml-5 w-full md:w-48 bg-cyan-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none"
                    >
                      {loading ? 'Añadiendo...' : 'Añadir'}
                    </button>
                  </div>
                  {error && (
                    <p className="text-red-700 text-sm mt-4">{error}</p>
                  )}
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default AddWorker;
