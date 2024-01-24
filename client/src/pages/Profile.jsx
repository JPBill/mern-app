import { useState } from 'react';
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

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const [updateSucess, setUpdateSuccess] = useState(false);

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
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
                    type="button"
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
            </div>
          </div>

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
                      defaultValue={currentUser.username}
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
