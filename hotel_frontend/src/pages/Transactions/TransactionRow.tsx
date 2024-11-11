import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from '../../api/transactionAPI'; // Импорт типа Transaction

interface TransactionRowProps {
  transaction: Transaction;
  onSave: (updatedTransaction: Transaction) => void;
  onDelete: () => void;
}

const paymentMethodTranslations: { [key: string]: string } = {
  cash: 'Наличные',
  non_cash: 'Безнал',
  terminal: 'Терминал',
  qr: 'QR-код',
  bank_transfer: 'Банковский перевод',
  crypto: 'Криптовалюта',
};

const TransactionRow: React.FC<TransactionRowProps> = ({
  transaction,
  onSave,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableTransaction, setEditableTransaction] = useState(transaction);

  // Преобразование данных с использованием useMemo
  const transformedTransaction = useMemo(() => {
    return {
      ...transaction,
      paymentMethod: transaction.payment_method || transaction.paymentMethod,
    };
  }, [transaction]);

  // Логируем transformedTransaction для проверки данных
  useEffect(() => {
    console.log('Transformed transaction:', transformedTransaction);
  }, [transformedTransaction]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log(`Field changed: ${name} => ${value}`);
    setEditableTransaction((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    console.log('Saving transaction:', editableTransaction);
    onSave(editableTransaction);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log(
      'Edit cancelled, resetting to original transaction:',
      transaction
    );
    setEditableTransaction(transaction);
    setIsEditing(false);
  };

  return (
    <tr>
      <td>
        {isEditing ? (
          <input
            type="date"
            name="date"
            value={editableTransaction.date || ''}
            onChange={handleChange}
          />
        ) : transformedTransaction.date ? (
          new Date(transformedTransaction.date).toLocaleDateString('ru-RU')
        ) : (
          'Дата не указана'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="description"
            value={editableTransaction.description || ''}
            onChange={handleChange}
          />
        ) : (
          transformedTransaction.description || '—'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="text"
            name="category"
            value={editableTransaction.category?.name || ''}
            onChange={handleChange}
          />
        ) : transformedTransaction.category &&
          transformedTransaction.category.name ? (
          transformedTransaction.category.name
        ) : (
          'N/A'
        )}
      </td>
      <td>
        {isEditing ? (
          <input
            type="number"
            name="amount"
            value={editableTransaction.amount || 0}
            onChange={handleChange}
          />
        ) : (
          <>
            {typeof transformedTransaction.amount === 'string'
              ? parseFloat(transformedTransaction.amount).toFixed(2)
              : typeof transformedTransaction.amount === 'number'
                ? transformedTransaction.amount.toFixed(2)
                : 'N/A'}
          </>
        )}
      </td>
      <td>{transformedTransaction.type === 'income' ? 'Доход' : 'Расход'}</td>
      <td>
        {isEditing ? (
          <select
            name="paymentMethod"
            value={editableTransaction.paymentMethod || ''}
            onChange={handleChange}
          >
            <option value="cash">Наличные</option>
            <option value="non_cash">Безнал</option>
            <option value="terminal">Терминал</option>
            <option value="qr">QR-код</option>
            <option value="bank_transfer">Банковский перевод</option>
            <option value="crypto">Криптовалюта</option>
          </select>
        ) : typeof transformedTransaction.paymentMethod === 'string' ? (
          paymentMethodTranslations[transformedTransaction.paymentMethod] ||
          transformedTransaction.paymentMethod
        ) : Array.isArray(transformedTransaction.paymentMethod) ? (
          paymentMethodTranslations[transformedTransaction.paymentMethod[0]] ||
          transformedTransaction.paymentMethod[0]
        ) : (
          'N/A'
        )}
      </td>
      <td>
        {transformedTransaction.employee
          ? transformedTransaction.employee
          : 'Сотрудник не указан'}
      </td>
      <td>
        {isEditing ? (
          <div className="action-buttons">
            <button onClick={handleSave} className="save-button">
              Сохранить
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Отмена
            </button>
          </div>
        ) : (
          <div className="action-buttons">
            <button
              onClick={() => {
                console.log('Editing started for transaction:', transaction);
                setIsEditing(true);
              }}
              className="edit-button"
            >
              Редактировать
            </button>
            <button
              onClick={() => {
                console.log('Deleting transaction with ID:', transaction.id);
                onDelete();
              }}
              className="delete-button"
            >
              Удалить
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default TransactionRow;
