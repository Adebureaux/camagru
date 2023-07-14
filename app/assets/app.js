import Model from "./model.js";
import View from "./view.js";
import Controller from "./controller.js";

const view = new View();
const model = new Model(view);
const controller = new Controller(model, view);