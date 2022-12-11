function square(x) {
    return x*x;
}
class TestResult {
    succeeded : boolean;          
    reason : string;            
    input : string;             
    expected_output : string;   
    actual_output : string;  
    
    constructor(succeeded, reason, input, expected_output, actual_output) {
        this.succeeded = succeeded;
        this.reason = reason;
        this.input = input;
        this.expected_output = expected_output;
        this.actual_output = actual_output;
    }
}

function executeTests() {
    let inputs = [0, 1, 2, 5];
    let expected_results = [0, 1, 4, 25];
    let results = [];

    for(let i=0; i < inputs.length; i++) {

        let output = square(inputs[i]);
        let succeeded = false;
        let reason = "Incorrect Output!";

        if(output == expected_results[i]){
            succeeded = true;
            reason = "Succeeded";
        }

        let result = new TestResult(succeeded, reason, String(inputs[i]), String(expected_results[i]), String(output));
        results.push(result);
    }

    return results;
}
function main() {
  let results = executeTests();
  let output = { test_results: results };

  console.log(JSON.stringify(output));
}

main();