import * as chai from "chai"
import * as sinonChai from "sinon-chai"
import * as chaiDom from "chai-dom"

chai.use(sinonChai)
chai.use(chaiDom)

const JSDOM = require("jsdom").JSDOM
const window = new JSDOM("<!doctype html><html><body></body></html>").window as any;
(global as any).window = window;
(global as any).document = window.document;
(global as any).HTMLElement = window.HTMLElement;
(global as any).Node = window.Node;
(global as any).Event = window.Event

