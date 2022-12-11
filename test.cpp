#include <iostream>
using namespace std;

int square(int n) {
  return n * n;
}
#include <vector>
#include <string>

struct TestResult {
  bool succeeded;
  std::string reason;
  std::string input;
  std::string expected_output;
  std::string actual_output;
  bool hidden;
};

std::vector<TestResult> executeTests() {
  std::vector<int> inputs = {0, 1, 2, 5};
  std::vector<int> expected_outputs = {0, 1, 4, 25};
  std::vector<bool> hide_test = {false, false, false, false};
  std::vector<TestResult> results;
  
  for (int i = 0; i < inputs.size(); i++) {
    results.emplace_back(TestResult());
    auto result = &(results.back());
    
    result->input = "square(" + std::to_string(inputs[i]) + ")";
  	result->expected_output = std::to_string(expected_outputs[i]);
  	
    auto actual_output = square(inputs[i]);
    result->actual_output = std::to_string(actual_output);
    result->hidden = hide_test[i];
    
    if (actual_output == expected_outputs[i]) {
      result->reason = "Succeeded";
      result->succeeded = true;
    } else {
      result->reason = "Incorrect Output";
      result->succeeded = false;
    }
  }
 
  return results;
}

#include <iostream>

int main() {
  std::vector<TestResult> results = executeTests();

  if (results.size() == 0) {
    return 0;
  }

  std::string output = "{\"test_results\": [";

  int count = 0;
  for (const TestResult& result : results) {
    if (count > 0) {
      output += ",";
    }
    output += "{";
    output += "\"reason\": \"" + result.reason + "\",";
    output += "\"input\": \"" + result.input + "\",";
    output += "\"expected_output\": \"" + result.expected_output + "\",";
    output += "\"actual_output\": \"" + result.actual_output + "\",";

    std::string succeededStr = result.succeeded ? "true" : "false";
    std::string hidden = result.hidden? "true" : "false";

    output += "\"succeeded\": " + succeededStr + ",";
    output += "\"hidden\": " + hidden + "}";

    count++;
  }


  output += "]}";

  std::cout << output;
  return 0;
}
