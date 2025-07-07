// In-memory mock data for demo purposes
let posts = [
  {
    _id: '1',
    user: {
      _id: 'u1',
      firstName: 'Demo',
      lastName: 'User',
      avatar: '',
      firebaseUid: 'demo-firebase-uid'
    },
    photo: '',
    ingredients: ['rice', 'chicken'],
    allergies: [],
    city: 'Demo City',
    address: '123 Demo St',
    description: 'A demo post',
    range: '',
    time: new Date(),
    reserved: false,
    createdAt: new Date()
  }
];

const find = async (filter = {}) => {
  // Simple filter for demo: only supports ingredients/city search
  let result = posts;
  if (filter.ingredients && filter.ingredients.$regex) {
    const regex = new RegExp(filter.ingredients.$regex, filter.ingredients.$options);
    result = result.filter(p => p.ingredients.some(i => regex.test(i)));
  }
  if (filter.city && filter.city.$regex) {
    const regex = new RegExp(filter.city.$regex, filter.city.$options);
    result = result.filter(p => regex.test(p.city));
  }
  return result;
};

const findById = async (id) => posts.find(p => p._id === id);

const create = async (data) => {
  const newPost = {
    _id: (posts.length + 1).toString(),
    ...data,
    createdAt: new Date(),
    reserved: false
  };
  posts.push(newPost);
  return newPost;
};

const findByIdAndUpdate = async (id, updates, opts) => {
  const idx = posts.findIndex(p => p._id === id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  return posts[idx];
};

const findOneAndUpdate = async (filter, updates, opts) => {
  const idx = posts.findIndex(p => p._id === filter._id);
  if (idx === -1) return null;
  posts[idx] = { ...posts[idx], ...updates };
  return posts[idx];
};

const findByIdAndDelete = async (id) => {
  const idx = posts.findIndex(p => p._id === id);
  if (idx === -1) return null;
  const deleted = posts.splice(idx, 1)[0];
  return deleted;
};

module.exports = {
  find,
  findById,
  create,
  findByIdAndUpdate,
  findOneAndUpdate,
  findByIdAndDelete
}; 