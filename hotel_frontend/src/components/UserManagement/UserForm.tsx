// src/components/UserManagement/UserForm.tsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { User } from '../../types/User';
import { createUser, updateUser } from '../../api/userAPI';
import '../../styles/UserForm.css';

interface UserFormProps {
  initialValues: User;
  onSubmitSuccess: () => void;
  onCancel: () => void; // Добавляем новый пропс для обработки отмены
}

const UserForm: React.FC<UserFormProps> = ({
  initialValues,
  onSubmitSuccess,
  onCancel, // Принимаем функцию отмены
}) => {
  const isEditMode = Boolean(initialValues.id);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Имя обязательно'),
    email: Yup.string()
      .email('Неверный формат email')
      .required('Email обязателен'),
    username: Yup.string().required('Имя пользователя обязательно'),
    password: isEditMode
      ? Yup.string()
      : Yup.string().required('Пароль обязателен'),
    role: Yup.string().required('Роль обязательна'),
    status: Yup.string().required('Статус обязателен'),
  });

  const handleSubmit = async (
    values: User,
    { setSubmitting }: FormikHelpers<User>
  ) => {
    try {
      if (isEditMode && values.id) {
        await updateUser(values.id, values);
      } else {
        await createUser(values);
      }
      onSubmitSuccess();
    } catch (error) {
      // Обработка ошибок
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="user-form">
      <h2>
        {isEditMode ? 'Редактировать пользователя' : 'Добавить пользователя'}
      </h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <label htmlFor="name">Имя</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" className="error" />

            <label htmlFor="email">Email</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" className="error" />

            <label htmlFor="username">Имя пользователя</label>
            <Field type="text" name="username" />
            <ErrorMessage name="username" component="div" className="error" />

            {!isEditMode && (
              <>
                <label htmlFor="password">Пароль</label>
                <Field type="password" name="password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </>
            )}

            <label htmlFor="role">Роль</label>
            <Field as="select" name="role">
              <option value="">Выберите роль</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
              {/* Добавьте другие роли */}
            </Field>
            <ErrorMessage name="role" component="div" className="error" />

            <label htmlFor="status">Статус</label>
            <Field as="select" name="status">
              <option value="">Выберите статус</option>
              <option value="active">Активен</option>
              <option value="blocked">Заблокирован</option>
            </Field>
            <ErrorMessage name="status" component="div" className="error" />

            <div className="form-buttons">
              <button type="submit" disabled={isSubmitting}>
                {isEditMode ? 'Сохранить изменения' : 'Добавить пользователя'}
              </button>
              <button type="button" onClick={onCancel}>
                Отмена
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UserForm;
