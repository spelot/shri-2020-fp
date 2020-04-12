/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from "../tools/api";
import {
  __,
  compose,
  then,
  prop,
  lte,
  gte,
  allPass,
  ifElse,
  tap,
  modulo,
  length,
} from "ramda";

const api = new Api();

// Taking data from Api
const getNumberFromApi = (number) =>
  api.get("https://api.tech/numbers/base", { from: 10, to: 2, number });
const getAnimalsApi = (id) => api.get(`https://animals.tech/${id}`, {});
const getConvertedNumber = (num) =>
  compose(then(prop("result")), getNumberFromApi)(num);
const getAnimals = (id) => compose(then(prop("result")), getAnimalsApi)(id);

const strToInt = (str) => compose(Math.round, parseFloat)(str);
const strLengthNumberTen = (str) => lte(str.length, 10);
const strLengthNumberTwo = (str) => gte(str.length, 2);

// Validation
const numberValidation = (str) => /^[0-9]+(\.)?[0-9]*$/.test(str);
const stringValidation = (str) =>
  allPass([strLengthNumberTen, strLengthNumberTwo, numberValidation])(str);
const square = (number) => number ** 2;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
  return compose(
    ifElse(
      stringValidation,
      compose(
        then(handleSuccess),
        then(
          compose(
            getAnimals,
            tap(writeLog),
            modulo(__, 3),
            tap(writeLog),
            square,
            tap(writeLog),
            length,
            tap(writeLog)
          )
        ),
        getConvertedNumber,
        strToInt
      ),
      () => handleError("ValidationError")
    ),
    tap(writeLog)
  )(value);
};

export default processSequence;
