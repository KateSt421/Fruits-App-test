// Статический импорт всех изображений
import annona from './annona.jpeg';
import tomato from './tomato.jpg';
import banana from './banana.jpg';
import kiwi from './kiwi.jpg';
import defaultFruit from './default.jpg';
import apple from './apple.jpg';
import apricot from './apricot.jpg';
import avocado from './avocado.jpg';
import blackberry from './blackberry.jpg';
import blueberry from './blueberry.jpg';
import ceylonGooseberry from './ceylonGooseberry.jpg';
import cherry from './cherry.jpg';
import cranberry from './blueberry.jpg';
import dragonfruit from './dragonfruit.jpg';
import durian from './durian.jpg';
import feijoa from './feijoa.jpeg';
import fig from './fig.jpg';
import gooseberry from './gooseberry.png';
import grape from './grape.jpg';
import greenApple from './greenApple.jpg';
import guava from './guava.jpg';
import hazelnut from './hazelnut.jpeg';
import hornedMelon from './hornedMelon.jpg';
import jackfruit from './jackfruit.jpg';
import japanesePersimmon from './japanesePersimmon.jpg';
import kiwifruit from './kiwifruit.png';
import lemon from './lemon.jpg';
import lime from './lime.jpg';
import lingonberry from './lingonberry.jpg';
import lychee from './lychee.jpg';
import mango from './mango.jpg';
import mangosteen from './mangosteen.jpg';
import melon from './melon.jpg';
import morus from './morus.jpg';
import orange from './orange.jpg';
import papaya from './papaya.jpg';
import passionfruit from './passionfruit.jpg';
import peach from './peach.jpg';
import pear from './pear.jpg';
import pineapple from './pineapple.jpg';
import persimmon from './persimmon.jpg';
import pitahaya from './pitahaya.png';
import plum from './plum.jpg';
import pomegranate from './pomegranate.jpg';
import pomelo from './pomelo.jpg';
import pumpkin from './pumpkin.jpg';
import raspberry from './raspberry.jpg';
import strawberry from './strawberry.jpg';
import tangerine from './tangerine.jpg';
import watermelon from './watermelon.jpg';



const fruitImages: Record<string, string> = {
  annona,
  tomato,
  banana,
  kiwi,
  apple,
  apricot,
  avocado,
  blackberry,
  blueberry,
  ceylongooseberry: ceylonGooseberry,
  cherry,
  cranberry,
  dragonfruit,
  durian,
  feijoa,
  fig,
  gooseberry,
  grape,
  greenapple: greenApple,
  guava,
  hazelnut,
  hornedmelon: hornedMelon,
  jackfruit,
  japanesepersimmon: japanesePersimmon,
  kiwifruit,
  lemon,
  lime,
  lingonberry,
  lychee,
  mango,
  mangosteen,
  melon,
  morus,
  orange,
  papaya,
  passionfruit,
  peach,
  pear,
  persimmon,
  pineapple,
  pitahaya,
  plum,
  pomegranate,
  pomelo,
  pumpkin,
  raspberry,
  strawberry,
  tangerine,
  watermelon,
  // добавьте другие фрукты
};

const normalizeFruitName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '') // Удаляем все пробелы
    .replace(/-/g, '')  // Удаляем дефисы (если есть)
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // Удаляем диакритические знаки
};

export const getFruitImage = (fruitName: string): string => {
  const imageKey = normalizeFruitName(fruitName);
  return fruitImages[imageKey] || defaultFruit;
};

export const defaultFruitImage = defaultFruit;
