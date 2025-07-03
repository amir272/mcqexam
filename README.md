* This MCQ exam application is built using Java spring boot and React
* Its built in such a way that we don't need separate builds for these frontend and backend services
* React application is also packed inside a jar
* This removes the requirement for separate deployment of applications
* #### How to package the jar: mvn clean package spring-boot:repackage
* This should generate a jar file in the target directory like exam-0.0.1-SNAPSHOT.jar
* #### How to run the jar(needs to be in the jar's directory): java -jar exam-0.0.1-SNAPSHOT.jar
* #### Features of the applicaiton:
  * Can add questions, options and answer keys at one go
  * Image can be added in the questions or any options however its not recommended to add in the answer keys
  * Having option for adding image will help in adding questions/options which might be difficult to add using texts eg. figures and mathematical symbols
  * A simple run of the jar file will start the application
* #### Format for adding questions, options and answer keys:
GQ Question 1 Gopts
Go 1 Option 1 for Question 1
Go 2 Option 2 for Question 1
Go 3 Option 3 for Question 1
Go 4 Option 4 for Question 1

GQ Question 2 Gopts
Go 1 Option 1 for Question 2
Go 2 Option 2 for Question 2
Go 3 Option 3 for Question 2
Go 4 Option 4 for Question 2
AnswerKeys
Gkey 2 Gkey 2
