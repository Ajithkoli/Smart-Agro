const bcrypt = require('bcryptjs');

// Helper to hash password manually if inserting directly (though model pre-save hook handles it usually, insertMany might bypass pre-save in some versions or if using raw docs. 
// However, Mongoose insertMany DOES trigger validation but NOT pre-save middleware unless { ordered: false, rawResult: false } options are set carefully or if using create(). 
// Let's use the model's create() logic in seeder or pre-hash here. 
// Actually, insertMany does NOT trigger pre('save') hooks. So we must hash here.

const hash = (pwd) => bcrypt.hashSync(pwd, 10);

const users = [
    {
        name: 'Admin User',
        email: 'admin@smartagri.com',
        password: hash('admin123'),
        role: 'admin',
        phone: '9998887770',
    },
    {
        name: 'John Farmer',
        email: 'john@farmer.com',
        password: hash('farmer123'),
        role: 'farmer',
        phone: '1234567890',
    },
    {
        name: 'Jane Planter',
        email: 'jane@farmer.com',
        password: hash('farmer123'),
        role: 'farmer',
        phone: '0987654321',
    },
];

module.exports = users;
