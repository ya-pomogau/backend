export default {
  messages: {
    isEmpty: 'Поле $property не может быть пустым',
    shouldBeString: 'Для поля $property допустимы только строковые значения',
    shouldBeBoolean: 'Для поля $property допустимы только булевые значения',
    shouldBeIntegerNumber: 'Для поля $property допустимы только целые числовые значения',
    shouldBePositiveNumber: 'Для поля $property допустимы только положительные числовые значения',
    tooShort: 'Минимальное количество символов в поле $property - $constraint1',
    tooLong: 'Максимальное количество символов в поле $property - $constraint1',
    strictValues: 'Допустимые значения в поле $property: ',
    incorrectUrl: 'В поле $property введен некорректный формат url-адреса',
    incorrectPhoneNumber: 'В поле $property введен некорректный формат телефонного номера',
    incorrectCoordinates: 'В поле $property введен некорректный формат географических координат',
  },
  limits: {
    categoryTitle: {
      min: 3,
      max: 30,
    },
    userName: {
      min: 2,
      max: 30,
    },
    address: {
      min: 7,
      max: 70,
    },
  },
};
