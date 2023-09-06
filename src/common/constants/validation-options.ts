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
    incorrectAdminPermissions: 'Поле $property должно быть в формате массива от 1 до 6 элементов',
    incorrectReportDates: 'Некорректный формат дат для отчета',
    min: 'Минимальное значение в поле $property - $constraint1',
    max: 'Максимальное значение в поле $property - $constraint1',
  },
  limits: {
    categoryTitle: {
      min: 3,
      max: 50,
    },
    userName: {
      min: 2,
      max: 30,
    },
    address: {
      min: 7,
      max: 70,
    },
    adminPermissions: {
      min: 1,
      max: 6,
    },
    userStatuses: {
      min: 1,
      max: 3,
    },
    login: {
      min: 5,
      max: 20,
    },
    task: {
      title: {
        min: 5,
        max: 30,
      },
      description: {
        min: 20,
        max: 200,
      },
    },
    categoryAccess: {
      min: 1,
      max: 3,
    },
    userStatus: {
      min: 0,
      max: 3,
    },
    blogArticle: {
      title: {
        min: 5,
        max: 50,
      },
      text: {
        min: 50,
      },
    },
  },
};
