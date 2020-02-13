const User = require('../models/user');

class userRepository {
    constructor(model) {
        this.model = model;
    }
    create(first, last, email, age){
        const newUser = {first, last, email, age};
        const User = new this.model(newUser);
        return User.save();
    }
    deleteById(id){
        return this.model.findByIdAndDelete(id);
    }
    findAll() {
        return this.model.find();
    }
    findByName(filterStr, isFirstName){
        let filterRegex = new RegExp(filterStr, 'i');
        console.log('filterRegex', filterRegex);
        if (isFirstName){
            return this.model.find({first: filterRegex})
        }
        else{
            return this.model.find({last: filterRegex});
        }
    }
    updateByID(id, object){
        return this.model.findByIdAndUpdate(id, object);
    }
    sortByColumn(colName, isAscending){
        let sortObj = {};
        sortObj[colName] = isAscending ? 1 : -1;
        return this.model.find().sort(sortObj);
    }
}

module.exports = new userRepository(User);