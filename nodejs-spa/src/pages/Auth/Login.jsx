import Input from '../../components/Folder/Input/Input';
import Button from '../../components/Button/Button';
import { required, length, email } from '../../util/validators';
import Auth from './Auth';
import {useState} from 'react';

const Login = ({onLogin, loading}) => {
    const [loginForm, setLoginForm] = useState({
        loginForm: {
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
            formIsValid: false
        }
    })

    const inputChangeHandler = (input, value) => {
        setLoginForm(prevState => {
            let isValid = true;
            for (const validator of prevState.loginForm[input].validators) {
                isValid = isValid && validator(value);
            }
            const updatedForm = {
                ...prevState.loginForm,
                [input]: {
                    ...prevState.loginForm[input],
                    valid: isValid,
                    value: value
                }
            };
            let formIsValid = true;
            for (const inputName in updatedForm) {
                formIsValid = formIsValid && updatedForm[inputName].valid;
            }
            return {
                loginForm: updatedForm,
                formIsValid: formIsValid
            };
        });
    };

    const inputBlurHandler = input => {
        setLoginForm(prevState => {
            return {
                loginForm: {
                    ...prevState.loginForm,
                    [input]: {
                        ...prevState.loginForm[input],
                        touched: true
                    }
                }
            };
        });
    };

    return (
        <Auth>
            <form
                onSubmit={e =>
                    onLogin(e, {
                        email: loginForm.loginForm.email.value,
                        password: loginForm.loginForm.password.value
                    })
                }
            >
                <Input
                    id="email"
                    label="Your E-Mail"
                    type="email"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler.bind(this, 'email')}
                    value={loginForm.loginForm['email'].value}
                    valid={loginForm.loginForm['email'].valid}
                    touched={loginForm.loginForm['email'].touched}
                />
                <Input
                    id="password"
                    label="Password"
                    type="password"
                    control="input"
                    onChange={inputChangeHandler}
                    onBlur={inputBlurHandler.bind(this, 'password')}
                    value={loginForm.loginForm['password'].value}
                    valid={loginForm.loginForm['password'].valid}
                    touched={loginForm.loginForm['password'].touched}
                />
                <Button design="raised" type="submit" loading={loading}>
                    Login
                </Button>
            </form>
        </Auth>
    )
}

export default Login;