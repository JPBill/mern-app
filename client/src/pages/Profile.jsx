import { useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
} from '../redux/user/userSlice';
import { LockClosedIcon, MailIcon, UserIcon } from '@heroicons/react/outline';
import { Menu, Transition } from '@headlessui/react';
import { DotsVerticalIcon } from '@heroicons/react/solid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSucess, setUpdateSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListing, setUserListing] = useState([]);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/server/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setUserListing((prevData) =>
        prevData.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleShowListing = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/server/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }
      setUserListing(data);
      console.log(data);
    } catch (error) {
      setShowListingError(true);
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/server/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/server/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div className="min-h-full">
      <div className="lg:pl-64 flex flex-col flex-1">
        <main className="flex-1 pb-8">
          {/* Page header */}
          <div className="bg-white shadow">
            <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
              <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                <div className="flex-1 min-w-0">
                  {/* Profile */}
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center">
                        <h2 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate">
                          Mi cuenta
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                  <button
                    onClick={handleShowListing}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Mis añadidos
                  </button>
                  <Link
                    to="/add-worker"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    Añadir profesional
                  </Link>
                </div>
              </div>
              <p className="text-red-700 text-center mt-3">
                {showListingError ? 'Error al mostrar el listado' : ''}
              </p>
              {userListing && userListing.length > 0 ? (
                <div className="pb-4 ">
                  <ul
                    role="list"
                    className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6"
                  >
                    {userListing.map((listing) => (
                      <li
                        key={listing._id}
                        className="relative col-span-1 flex shadow-sm rounded-md p-4 border border-gray-200"
                      >
                        <div className="w-16 h-16">
                          <img
                            src={listing.image}
                            className="h-full w-full object-cover rounded-md p-2"
                            alt={listing.animal}
                          />
                        </div>
                        <div className="flex-1 flex items-center justify-between truncate">
                          <div className="flex-1 px-4 py-2 text-sm truncate">
                            <p className="text-sm font-medium text-gray-500 truncate">
                              {listing.name}
                            </p>
                            <p className="text-lg font-medium text-gray-900">
                              {listing.category}
                            </p>
                          </div>
                          <Menu as="div" className="flex-shrink-0 pr-2">
                            <Menu.Button className="w-8 h-8 bg-white inline-flex items-center justify-center text-gray-400 rounded-full hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                              <span className="sr-only">Open options</span>
                              <DotsVerticalIcon
                                className="w-5 h-5"
                                aria-hidden="true"
                              />
                            </Menu.Button>
                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="z-10 mx-3 origin-top-right absolute right-10 top-3 w-48 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none">
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to="/"
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        Ver más
                                      </Link>
                                    )}
                                  </Menu.Item>
                                </div>
                                <div className="py-1">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <Link
                                        to={`/update-worker/${listing._id}`}
                                        className={classNames(
                                          active
                                            ? 'bg-gray-100 text-gray-900'
                                            : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        Editar
                                      </Link>
                                    )}
                                  </Menu.Item>
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        onClick={() =>
                                          handleListingDelete(listing._id)
                                        }
                                        className={classNames(
                                          active
                                            ? 'text-red-700'
                                            : 'text-gray-700',
                                          'block px-4 py-2 text-sm'
                                        )}
                                      >
                                        Eliminar
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>

          {/* Edit user profile section */}
          <div className="mt-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-1">
              <h4 className="text-lg leading-6 font-medium text-gray-900">
                Editar perfil
              </h4>
              <form
                onSubmit={handleSubmit}
                className="divide-y divide-gray-200"
              >
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <label
                    htmlFor="username"
                    className="text-sm font-medium text-gray-500 py-2"
                  >
                    Nombre
                  </label>
                  <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      onChange={handleChange}
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
                    htmlFor="email"
                    className="text-sm font-medium text-gray-500 py-2"
                  >
                    Email
                  </label>
                  <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      onChange={handleChange}
                      defaultValue={currentUser.email}
                      required
                      className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    />

                    <div className="ml-4 flex-shrink-0 py-2">
                      <MailIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-500 py-2"
                  >
                    Contraseña
                  </label>
                  <div className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      onChange={handleChange}
                      required
                      className="flex-grow px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    />

                    <div className="ml-4 flex-shrink-0 py-2">
                      <LockClosedIcon className="h-6 w-6 text-gray-500" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start p-4">
                  <p className="text-red-700">{error ? error : ''}</p>
                  <p className="text-green-700">
                    {updateSucess ? 'Usuario actualizado éxitosamente' : ''}
                  </p>
                </div>
                <div className="py-4 flex flex-col md:flex-row justify-center md:justify-end">
                  <button
                    onClick={handleDeleteUser}
                    className="w-full md:w-48 border border-red-300 shadow-sm py-2 px-3 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-gray-50 focus:outline-none"
                  >
                    Eliminar cuenta
                  </button>
                  <button
                    disabled={loading}
                    className="ml-0 mt-2 md:mt-0 md:ml-5 w-full md:w-48 bg-cyan-700 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-cyan-800 focus:outline-none"
                  >
                    {loading ? 'Cargando...' : 'Guardar cambios'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
