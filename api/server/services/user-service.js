import database from '../src/models';

const getProfileById = async (id) => {
  try {
    return await database.User.findByPk(id)
  } catch (error) {
    console.log("Profile not found",error);
  }
}

const updateUser = async (data) => {
  try {
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('User could not been updated.');
  }
}


module.exports = { getProfileById, updateUser }