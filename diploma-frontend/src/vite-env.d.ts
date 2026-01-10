// On dit à TypeScript : "T'inquiète pas, l'objet Window peut avoir une propriété ethereum"
interface Window {
  ethereum: any;
}