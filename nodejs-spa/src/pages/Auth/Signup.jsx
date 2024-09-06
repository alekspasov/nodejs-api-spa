import Input from '../../components/Folder/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators.js';
import Auth from './Auth';
import {useState} from 'react';


const Signup = ({onSignup, loading}) => {
    const [signupForm, setSignupForm] = useState({
        signupForm: {
            email: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, email]
            },
            password: {
                value: '',
                valid: false,
                touched: false,
                validators: [required, length({ min: 5 })]
            },
            name: {
                value: '',
                valid: false,
                touched: false,
                validators: [required]
            },
            formIsValid: false
        }
    })

    const inputChangeHandler = (input, value) => {
        setSignupForm(prevState => {
            let isValid = true;
            for (const validator of prevState.signupForm[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.signupForm,
                [input]: {
                    ...prevState.signupForm[input],
                    valid: isValid,
                    value: value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                signupForm: updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    const  inputBlurHandler = input => {
        setSignupForm(prevState => {
            return {
                signupForm: {
                    ...prevState.signupForm,
                    [input]: {
                        ...prevState.signupForm[input],
                        touched: true
                    }
                }
            };
        });
    };

    return (
        <Auth>
            <form onSubmit={e => onSignup(e, signupForm)}>
                <Input
                    id="email"
                    label="Your E-Mail"
                    type="email"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler.bind(this, 'email')}
                    value={signupForm.signupForm['email'].value}
                    valid={signupForm.signupForm['email'].valid}
                    touched={signupForm.signupForm['email'].touched}
                />
                <Input
                    id="name"
                    label="Your Name"
                    type="text"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler.bind(this, 'name')}
                    value={signupForm.signupForm['name'].value}
                    valid={signupForm.signupForm['name'].valid}
                    touched={signupForm.signupForm['name'].touched}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler.bind(this, 'password')}
                    value={signupForm.signupForm['password'].value}
                    valid={signupForm.signupForm['password'].valid}
                    touched={signupForm.signupForm['password'].touched}
                />
                <Button design="raised" type="submit" loading={loading}>
                    Signup
                </Button>
            </form>
        </Auth>
    )
}

export default Signup;