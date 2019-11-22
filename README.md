# buyvsrent


A simple buy vs rent calculator.


##Outline

This started as a Python file put together by a friend of my brother (dgmp88). It has since been re-written in JS to keep it as simple as possible and to allow users to run it without having an unnecessary back end.

The intention was to create a simple interface that would allow users to compare the different costs over n years between buying and renting a property.

##Instructions and use.

Clone or download the repository, open in your preferred code-editor then open index.html in your browser of choice.  
When it has opened in your browser, add in your numbers for buying & renting a property and review the results populated on the right hand side.

##Process

As the python file had already been written, rewriting in JS was the next step. After this I began building the front end, ensuring all relevant figures were being passed to the correct functions.

##Challenges

1. CHALLENGE: ensuring that if the final mortgage payment was a part payment (e.g. payments are 2,000/month but the final payment is <£2,000), any remaining balance was paid into the savings account.
SOLUTION

2. CHALLENGE: de-conflicting common results from outputs when populating the results table.
SOLUTION: running seperate funcitons for populating the results for each section reduced confusion.
