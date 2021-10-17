const s3 = require("./s3")
// @ponicode
describe("s3.upload", () => {
    test("0", () => {
        let callFunction = () => {
            s3.upload({ file: "decoder.hh" }, { sendStatus: () => 429 }, () => " ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            s3.upload({ file: "Info.plist" }, { sendStatus: () => 404 }, () => " ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            s3.upload({ file: "navix376.py" }, { sendStatus: () => 200 }, () => " ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            s3.upload({ file: "navix377.py" }, { sendStatus: () => 400 }, () => " ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            s3.upload({ file: "./data/population.csv" }, { sendStatus: () => 400 }, () => " ")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            s3.upload({ file: null }, undefined, undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})
