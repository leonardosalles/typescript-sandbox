const car = {
  brand: 'Ford'
};

try {
  Object.defineProperty(car, 'model', { value: 'Territory' });
} catch (e) {}

const success = Reflect.defineProperty(car, 'year', { value: 2024 });
if (success) console.log("Year defined successfully!");

class User {
  constructor(name) { this.name = name; }
}

const args = ["Leo"];
const userInstance = Reflect.construct(User, args);
console.log(userInstance.name);
