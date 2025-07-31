import '../styles/Signup.css'
import InputComponent from './InputComponent';
import { useForm } from 'react-hook-form'
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const {
        register,
        handleSubmit,
        watch,
        formState: {errors}
    } = useForm();
    const navigate = useNavigate();
    const password = watch('password');

    const onSubmit = async ({email, password, displayName}) => {
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    displayName
                }
            }
        })

        if(error) {
            alert(`회원가입 오류: ${error.message}`);
        } else {
            alert('회원가입 성공! 이메일을 확인하세요.');
            navigate('/login');
        }
    }

    return (
        <div className="my-signup">
            <div className="signup-part">
                <h1>회원가입</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <InputComponent
                        label="이메일"
                        name="email"
                        type="email"
                        register={register}
                        errors={errors}
                        rules={{
                            required: '이메일은 필수 입력입니다.',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: '올바른 이메일 형식이 아닙니다.',
                            },
                        }}
                    />

                    <InputComponent
                        label='이름'
                        name='displayName'
                        type='text'
                        register={register}
                        errors={errors}
                        rules={{
                            required: '이름은 필수 입력입니다.',
                            minLength: {
                                value: 2,
                                message: '이름은 최소 2자 이상이어야 합니다.'
                            },
                            maxLength: {
                                value: 8,
                                message: '이름은 최대 8자 이하여야 합니다.'
                            }
                        }}
                    />

                    <InputComponent
                        label="비밀번호(8~20자)"
                        name="password"
                        type="password"
                        register={register}
                        errors={errors}
                        rules={{
                            required: '비밀번호는 필수 입력입니다.',
                            minLength: {
                                value: 8,
                                message: '비밀번호는 최소 8자 이상이어야 합니다.',
                            },
                            maxLength: {
                                value: 20,
                                message: '비밀번호는 최대 20자 이하로 입력하세요.',
                            },
                            pattern: {
                                value: /^[a-zA-Z0-9]*$/,
                                message: '비밀번호는 영문대소문자, 숫자만 가능합니다.'
                            }
                        }}
                    />
                    <InputComponent
                        label="비밀번호 확인"
                        name="confirmPassword"
                        type="password"
                        register={register}
                        errors={errors}
                        rules={{
                            required: '비밀번호 확인은 필수입니다.',
                            validate: value => 
                                value === password || '비밀번호가 일치하지 않습니다.',
                        }}
                    />
                    <button type='submit'>회원가입</button>
                </form>
            </div>
        </div>
    );
}