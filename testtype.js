function square(x) {
    return x * x;
}
var TestResult = /** @class */ (function () {
    function TestResult(succeeded, reason, input, expected_output, actual_output) {
        this.succeeded = succeeded;
        this.reason = reason;
        this.input = input;
        this.expected_output = expected_output;
        this.actual_output = actual_output;
    }
    return TestResult;
}());
function executeTests() {
    var inputs = [0, 1, 2, 5];
    var expected_results = [0, 1, 4, 25];
    var results = [];
    for (var i = 0; i < inputs.length; i++) {
        var output = square(inputs[i]);
        var succeeded = false;
        var reason = "Incorrect Output!";
        if (output == expected_results[i]) {
            succeeded = true;
            reason = "Succeeded";
        }
        var result = new TestResult(succeeded, reason, String(inputs[i]), String(expected_results[i]), String(output));
        results.push(result);
    }
    return results;
}
function main() {
    var results = executeTests();
    var output = { test_results: results };
    console.log(JSON.stringify(output));
}
main();
