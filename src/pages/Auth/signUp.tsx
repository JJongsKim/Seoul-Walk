import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as S from './style';

import AuthLogo from '@components/Auth/AuthLogo';
import InputBase from '@components/common/InputBase';
import ButtonBase from '@components/common/ButtonBase';
import Toast from '@components/common/Toast';
import useSignUp from '@hooks/api/users/useSignUp';
import useToast from '@hooks/useToast';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast, handleFloatingToast } = useToast();
  const [signUpForm, setSignUpForm] = useState({
    userName: '',
    userId: '',
    userPassword: '',
    checkPassword: '',
  });
  const [checkPassword, isCheckPassword] = useState(true);

  const handleChangeForm = (name: string, value: string) => {
    setSignUpForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const { mutate: signUpMutate } = useSignUp();

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e?.preventDefault();

    if (signUpForm.userPassword === signUpForm.checkPassword && signUpForm.checkPassword !== '') {
      handleFloatingToast();

      setTimeout(() => {
        signUpMutate(
          {
            nickname: signUpForm.userName,
            user_id: signUpForm.userId,
            password: signUpForm.userPassword,
          },
          {
            onSuccess: () => {
              navigate('/sign-in');
            },
          },
        );
      }, 2200);
    } else {
      isCheckPassword(false);
    }
  };

  return (
    <S.DeskTopViewWrap>
      <S.SignFormWrap>
        <AuthLogo title="회원가입" />
        <S.SignForm onSubmit={handleSubmit}>
          <S.FormListWrap>
            <li>
              <InputBase
                placeholder="이름을 입력해주세요!"
                type="text"
                name="userName"
                value={signUpForm.userName}
                onChange={e => handleChangeForm('userName', e.target.value)}
              />
            </li>
            <li>
              <InputBase
                placeholder="아이디를 입력해주세요!"
                type="text"
                name="userId"
                value={signUpForm.userId}
                onChange={e => handleChangeForm('userId', e.target.value)}
              />
            </li>
            <li>
              <InputBase
                placeholder="비밀번호를 입력해주세요!"
                type="password"
                name="userPassword"
                value={signUpForm.userPassword}
                onChange={e => handleChangeForm('userPassword', e.target.value)}
              />
            </li>
            <li>
              <InputBase
                placeholder="비밀번호를 한 번 더 입력해주세요!"
                type="password"
                name="checkPassword"
                value={signUpForm.checkPassword}
                onChange={e => handleChangeForm('checkPassword', e.target.value)}
              />
            </li>
            {!checkPassword && <S.CheckText>비밀번호를 다시 확인해주세요!</S.CheckText>}
          </S.FormListWrap>
          <S.SubmitWrap>
            <Link to="/sign-in">
              <S.SubmitText>이미 가입하셨나요?</S.SubmitText>
            </Link>
            <ButtonBase name="회원가입" />
          </S.SubmitWrap>
        </S.SignForm>
      </S.SignFormWrap>
      {toast && <Toast>회원가입이 완료되었어요!</Toast>}
    </S.DeskTopViewWrap>
  );
};

export default SignUp;
