#include<stdio.h>

int square(int n) {
	return n * n;
}
/* Educative's Test Runner calls 'executeTests' that 
should return a double pointer (TestResultPtr* defined below).
Each TestResult object forms a Row in the output table

The following sample is for testing the function 
'square' which takes an integer and returns an integer
e.g.

int square(int n) {
	return n * n;
} */


#include <string.h>
#include <stdbool.h>
#include <stdlib.h>

/* You can update the values of macros below but DO NOT remove these macros*/
#define OUTPUT_STR_LENGTH 1000
#define REASON_STR_LENGTH 25
#define INPUT_STR_LENGTH 25
#define EXPECTED_OUTPUT_STR_LENGTH 25
#define ACTUAL_OUTPUT_STR_LENGTH 25
#define TOTAL_INPUTS 4
/* ----------------------------------------------- */ 


typedef struct {
  bool succeeded;
  char reason[REASON_STR_LENGTH];
  char input[INPUT_STR_LENGTH];
  char expected_output[EXPECTED_OUTPUT_STR_LENGTH];
  char actual_output[ACTUAL_OUTPUT_STR_LENGTH];
} TestResult;

typedef TestResult* TestResultPtr;

TestResultPtr* executeTests() {
    int i=0;
    int inputs[TOTAL_INPUTS] = {1, 2, 3, 4};
    int expected_outputs[TOTAL_INPUTS] = {1, 4, 9, 16};

    TestResultPtr* results = (TestResultPtr*) malloc(TOTAL_INPUTS * sizeof(TestResultPtr));
    for (i=0; i<TOTAL_INPUTS; i++) {
        results[i] = (TestResultPtr) malloc(sizeof(TestResult));
    }
    for (i=0; i<TOTAL_INPUTS; i++) {

        sprintf(results[i]->input, "square(%d)", inputs[i]);
        sprintf(results[i]->expected_output, "%d", expected_outputs[i]);
        sprintf(results[i]->actual_output, "%d", square(inputs[i]));
        
        int success = (0 == strcmp(results[i]->actual_output, results[i]->expected_output));
        
        if (success) {
            strcpy(results[i]->reason, "Succeeded");
            results[i]->succeeded = true;
        } else {
            strcpy(results[i]->reason, "Incorrect Output");
            results[i]->succeeded = false;
        }
    }
    return results;
}