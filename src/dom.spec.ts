import {
    setCheckboxValue,
    setRadioButton,
    setSelectValue,
    setTextAreaValue,
    setTextInputValue,
    trigger,
} from "./index"
import {expect} from "chai"
import {where} from "mocha-where"

function htmlToElement(html: string) {
    const template = document.createElement("template")
    template.innerHTML = html.trim()
    return template.content.firstChild as Element
}

function eventHandlerPromise(action: string, element: Element): Promise<Event> {
    return new Promise<Event>(resolve => {
        element.addEventListener(action, resolve)
    })
}

describe("DOM", () => {

    it('setTextInputValue() sets the value of <input type="text"> elements', () => {
        const element = htmlToElement(`<input type="text" value="">`) as HTMLInputElement
        setTextInputValue(element, "hello world!")

        expect(element.value).to.equal("hello world!")
    })

    it("setTextAreaValue() sets the value of <textarea> elements", () => {
        const element = htmlToElement(`<textarea></textarea>`) as HTMLTextAreaElement
        setTextAreaValue(element, "hello world!")

        expect(element.value).to.equal("hello world!")
    })

    describe("setSelectValue() sets the value of select elements", () => {

        it("when options have no value attributes", () => {
            const element = htmlToElement(`
                    <select>
                        <option></option>
                        <option>Hello</option>
                        <option>Goodbye</option>
                    </select>
                `) as HTMLSelectElement

            setSelectValue(element, "Goodbye")
            expect(element.selectedIndex).to.equal(2)
        })

        it("when options have value attributes", () => {
            const element = htmlToElement(`
                    <select>
                        <option></option>
                        <option value="Hola">Hello</option>
                        <option value="Adios">Goodbye</option>
                    </select>
                `) as HTMLSelectElement

            setSelectValue(element, "Hola")
            expect(element.selectedIndex).to.equal(1)
        })

    })

    it('setRadioButton() sets the value of <input type="radio"> elements', () => {
        const element = htmlToElement(`
            <div>
                <input type="radio" name="radio" value="Yes">
                <input type="radio" name="radio" value="No">
            </div>
        `) as HTMLInputElement
        const [first] = Array.from(element.children) as HTMLInputElement[]

        setRadioButton(first, true)
        expect(first.checked).to.equal(true)
    })

    it('setCheckboxValue() sets the value of <input type="check"> elements', () => {
        const element = htmlToElement(`<input type="checkbox">`) as HTMLInputElement

        setCheckboxValue(element, true)
        expect(element.checked).to.equal(true)

        setCheckboxValue(element, false)
        expect(element.checked).to.equal(false)
    })

    const mouseEvents = [
        "mouseenter", "mouseover", "mousemove", "mouseup", "auxclick", "click", "dblclick",
        "contextmenu", "wheel", "mouseleave", "mouseout", "select", "pointerlockchange", "pointerlockerror",
    ]
    const keyboardEvents = ["keydown", "keypress", "keyup", "input"]
    const focusEvents = ["focus", "blur"]
    const formEvents = ["reset", "submit"]
    const dragAndDropEvents = ["dragstart", "drag", "dragend", "dragenter", "dragover", "dragleave", "drop"]
    const clipBoardEvents = ["cut", "copy", "paste"]

    where([
        ["event"],
        ["change"],
        ...[
            ...mouseEvents,
            ...keyboardEvents,
            ...focusEvents,
            ...formEvents,
            ...dragAndDropEvents,
            ...clipBoardEvents,
        ].map(event => [event]),

    ]).describe("trigger() with #event", (scenario) => {

        it("triggers the provided event on the element", async () => {
            const element = htmlToElement(`<input type="text">`) as HTMLInputElement
            const event = eventHandlerPromise(scenario.event, element)
            trigger(element, scenario.event)

            expect((await event).target).to.equal(element)
        })

        it("bubbles up the DOM tree", async () => {
            const element = htmlToElement(`
                <div>
                    <div>
                        <input type="text">
                    </div>
                </div>
            `) as HTMLInputElement
            const input = element!.querySelector("input")

            const event = eventHandlerPromise(scenario.event, element)
            trigger(input, scenario.event)

            expect((await event).target).to.equal(input)
        })

        it("allows stopping propagation of event bubbling", () => {
            const element = htmlToElement(`
                <div>
                    <div>
                        <input type="text">
                    </div>
                </div>
            `) as HTMLInputElement
            const input = element.querySelector("input")!

            let inputTriggered = false
            input.addEventListener(scenario.event, event => {
                inputTriggered = true
                event.stopPropagation()
            })

            let grandparentTriggered = false
            element.addEventListener(scenario.event, event => {
                grandparentTriggered = true
            })

            trigger(input, scenario.event)

            expect(inputTriggered).to.equal(true)
            expect(grandparentTriggered).to.equal(false)
        })

        it("allows providing properties for the event", async () => {
            const element = htmlToElement(`<input type="text">`) as HTMLInputElement
            const event = eventHandlerPromise(scenario.event, element) as Promise<any>
            trigger(element, scenario.event, { keyCode: 55 })

            expect((await event).keyCode).to.equal(55)
        })

    })

    it("trigger() does not cause page reloads when used with submit", async () => {
        const element = htmlToElement(`<form ></form>`) as HTMLInputElement
        const event = eventHandlerPromise("submit", element)
        trigger(element, "submit")

        expect((await event).target).to.equal(element)
    })

    where([
        ["name",                    "method"            ],
        [setTextInputValue.name,    setTextInputValue   ],
        [setSelectValue.name,       setSelectValue      ],
        [setTextAreaValue.name,     setTextAreaValue    ],
        [setCheckboxValue.name,     setCheckboxValue    ],
        [setRadioButton.name,       setRadioButton      ],
        [trigger.name,              trigger             ],
    ])
    .it("#name() throws an error when the element is null", (scenario) => {
        expect(() => scenario.method(null, "")).to.throw("Element is not present")
    })

})
