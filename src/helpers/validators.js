/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
  anyPass,
  allPass,
  compose,
  equals,
  invert,
  map,
  prop,
  not,
  propOr,
  length,
  lte,
  all,
} from "ramda";
import { SHAPES, COLORS } from "../constants";

const { TRIANGLE, SQUARE, CIRCLE, STAR } = SHAPES;
const { RED, BLUE, ORANGE, GREEN, WHITE } = COLORS;

const getTriangle = prop(TRIANGLE);
const getSquare = prop(SQUARE);
const getCircle = prop(CIRCLE);
const getStar = prop(STAR);

const isRed = equals(RED);
const isBlue = equals(BLUE);
const isOrange = equals(ORANGE);
const isGreen = equals(GREEN);
const isWhite = equals(WHITE);

const isNotWhite = compose(not, isWhite);
const isNotRed = compose(not, isRed);

const isStarRed = compose(isRed, getStar);
const isStarNotRed = compose(isNotRed, getStar);
const isStarNotWhite = compose(isNotWhite, getStar);

const isSquareWhite = compose(isWhite, getSquare);
const isSquareGreen = compose(isGreen, getSquare);
const isSquareOrange = compose(isOrange, getSquare);

const isTriangleWhite = compose(isWhite, getTriangle);
const isTriangleGreen = compose(isGreen, getTriangle);
const isTriangleNotWhite = compose(isNotWhite, getTriangle);

const isCircleBlue = compose(isBlue, getCircle);
const isCircleNotWhite = compose(isNotWhite, getCircle);

const propOrZero = propOr(0);
const getCountColorObject = compose(map(length), invert);
const getWhiteCount = compose(propOrZero(WHITE), getCountColorObject);
const getGreenCount = compose(propOrZero(GREEN), getCountColorObject);
const getRedCount = compose(propOrZero(RED), getCountColorObject);
const getOrangeCount = compose(propOrZero(ORANGE), getCountColorObject);
const getBlueCount = compose(propOrZero(BLUE), getCountColorObject);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (data) => {
  if (anyPass([isTriangleNotWhite, isCircleNotWhite])(data)) return false;

  return allPass([isStarRed, isSquareGreen])(data);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (data) => {
  return compose(lte(2), getGreenCount)(data);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (data) => {
  return equals(getBlueCount(data), getRedCount(data));
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = (data) => {
  return allPass([isCircleBlue, isStarRed, isSquareOrange])(data);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (data) => {
  if (compose(lte(2), getWhiteCount)(data)) return false;

  const isRedMoreThan3 = compose(lte(3), getRedCount);
  const isBlueMoreThan3 = compose(lte(3), getBlueCount);
  const isOrangeMoreThan3 = compose(lte(3), getOrangeCount);
  const isGreenMoreThan3 = compose(lte(3), getGreenCount);

  return anyPass([
    isRedMoreThan3,
    isBlueMoreThan3,
    isOrangeMoreThan3,
    isGreenMoreThan3,
  ])(data);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = (data) => {
  const isGreenEqual2 = compose(equals(2), getGreenCount);
  const isRedEqual1 = compose(equals(1), getRedCount);
  return allPass([isGreenEqual2, isRedEqual1, isTriangleGreen])(data);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (data) => {
  return all(isOrange)(Object.values(data));
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = (data) => {
  return allPass([isStarNotRed, isStarNotWhite])(data);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (data) => {
  return all(isGreen)(Object.values(data));
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = (data) => {
  if (anyPass([isTriangleWhite, isSquareWhite])(data)) return false;

  return equals(getTriangle(data), getSquare(data));
};
