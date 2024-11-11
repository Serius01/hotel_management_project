// src/components/RoleManagement/RoleForm.tsx

import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Role, Permission } from '../../types/Role';
import { fetchPermissions, createRole, updateRole } from '../../api/roleAPI';
import '../../styles/RoleForm.css';

interface RoleFormProps {
  initialValues: Role;
  onSubmitSuccess: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({
  initialValues,
  onSubmitSuccess,
}) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const isEditMode = Boolean(initialValues.id);

  useEffect(() => {
    const loadPermissions = async () => {
      const data = await fetchPermissions();
      setPermissions(data);
    };
    loadPermissions();
  }, []);

  const handleSubmit = async (
    values: Role,
    { setSubmitting }: FormikHelpers<Role>
  ) => {
    try {
      if (isEditMode && values.id) {
        await updateRole(values.id, values);
      } else {
        await createRole(values);
      }
      onSubmitSuccess();
    } catch (error) {
      // Обработка ошибок
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="role-form">
      <h2>{isEditMode ? 'Редактировать роль' : 'Добавить роль'}</h2>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ isSubmitting, values, setFieldValue }) => (
          <Form>
            <label htmlFor="name">Название роли</label>
            <Field type="text" name="name" />

            <label>Права доступа</label>
            <div className="permissions-list">
              {permissions.map((permission) => (
                <div key={permission.id}>
                  <input
                    type="checkbox"
                    id={`perm-${permission.id}`}
                    name="permissions"
                    value={permission.id}
                    checked={values.permissions.some(
                      (perm) => perm.id === permission.id
                    )}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      const newPermissions = isChecked
                        ? [...values.permissions, permission]
                        : values.permissions.filter(
                            (perm) => perm.id !== permission.id
                          );
                      setFieldValue('permissions', newPermissions);
                    }}
                  />
                  <label htmlFor={`perm-${permission.id}`}>
                    {permission.name}
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" disabled={isSubmitting}>
              {isEditMode ? 'Сохранить изменения' : 'Добавить роль'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RoleForm;
