const alphanumericRegExp = new RegExp(/^[a-zA-Z0-9]*$/);
const emailRegExp = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
const nameRegExp = new RegExp(/^[a-zA-Z'-]*$/);
const passwordRegExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d]).{0,}$/i);

function validate(input, validators) {
  let validation = [];
  let error = false;
  
  for(let i = 0; i < validators.length; i++) {
    let res = validators[i](input);
    if(res) {
      validation.push({ key: i, message: res.message, type: res.type });
      if(res.type === 'error')
        error = true;
    }
  }

  return { validation, error };
}

function lengthValidator(min, max, message) {
  return input => {
    if(!input || input.length < min || input.length > max)
      return { message, type: 'error' };
    return null;
  }
}

function regExpValidator(regExp, message) {
  return input => {
    if(!regExp.test(input))
      return { message, type: 'error' };
    return null;
  }
}

const usernameValidators = [
  lengthValidator(3, 15, 'Username must between 3 and 15 characters long'),
  regExpValidator(alphanumericRegExp, 'Username can\'t contain special characters')
]

const validateUsername = (username) => {
  return validate(username, usernameValidators);
};

const firstNameValidators = [
  lengthValidator(1, 30, 'First name must between 1 and 30 characters long'),
  regExpValidator(nameRegExp, 'First name can\'t contain special characters')
]

const validateFirstName = (first_name) => {
  return validate(first_name, firstNameValidators);
};

const lastNameValidators = [
  lengthValidator(1, 30, 'Last name must between 1 and 30 characters long'),
  regExpValidator(nameRegExp, 'Last name can\'t contain special characters')
]

const validateLastName = (last_name) => {
  return validate(last_name, lastNameValidators);
};

const emailValidators = [
  regExpValidator(emailRegExp, 'Invalid email')
]

const validateEmail = (email) => {
  return validate(email, emailValidators);
};

const passwordValidators = [
  lengthValidator(8, 35, 'Password must between 8 and 35 characters long'),
  regExpValidator(passwordRegExp, 'Password must have at least one uppercase, lowercase and special character, and a number')
]

const validatePassword = (password) => {
  return validate(password, passwordValidators);
};

const validatePasswordConfirm = (password, password_confirm) => {
  let validation = [];
  let error = false;
  if(password !== password_confirm){
    validation.push({ key: 1, message: 'Passwords don\'t match', type: 'error' });
    error = true;
  } else {
    validation.push({ key: 1, message: 'Passwords match', type: 'success' });
  }
  return { validation, error };
};

export default {
  validateUsername, validateFirstName, validateLastName, validateEmail, validatePassword, validatePasswordConfirm
}