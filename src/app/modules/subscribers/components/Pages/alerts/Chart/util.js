export const background = (main, stripes = false, stripesColor = '#02486e') => !stripes ? main : `repeating-linear-gradient(
    45deg,
    ${main},
    ${main} 1.5px,
    ${stripesColor} 1.5px,
    ${stripesColor} 3px
)`;
