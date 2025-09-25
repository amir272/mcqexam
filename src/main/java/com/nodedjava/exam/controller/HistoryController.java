package com.nodedjava.exam.controller;

import com.nodedjava.exam.entity.History;
import com.nodedjava.exam.entity.Quiz;
import com.nodedjava.exam.entity.User;
import com.nodedjava.exam.service.HistoryService;
import com.nodedjava.exam.service.QuizService;
import com.nodedjava.exam.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
public class HistoryController {

    @Autowired
    HistoryService historyService;
    @Autowired
    QuizService quizService;
    @Autowired
    UserService userService;

    @GetMapping(value = "/api/histories")
    public ResponseEntity<List<History>> getHistories(){
        List<History> histories = setQuizTitle(historyService.getHistories());
        histories = setUser(histories);
        return new ResponseEntity<>(histories, HttpStatus.OK);
    }

    @GetMapping(value = "/api/history-user/{username}")
    public ResponseEntity<List<History>> getHistoryByUser(@PathVariable("username") String username){
        List<History> histories = setQuizTitle(historyService.getHistoryByUser(username));
        histories = setUser(histories);
        return new ResponseEntity<>(histories, HttpStatus.OK);
    }

    @GetMapping(value = "/api/history-shift/{shift}")
    public ResponseEntity<List<History>> getHistoryByShift(@PathVariable("shift") String shift) {
        List<History> histories = historyService.getHistoryByShift(shift);
        if (histories != null && !histories.isEmpty()) {
            histories.forEach(history -> {
                String quizId = history.getQuizId();
                Quiz quiz = quizService.getByQuizId(quizId);
                String quizTitle = "";
                if (quiz == null) {
                    quizTitle = "Quiz not found";
                } else quizTitle = quiz.getTitle();
                history.setQuizId(quizTitle);
            });
            histories = setUser(histories);
            return new ResponseEntity<>(histories, HttpStatus.OK);
        } else return null;
    }


    @PostMapping("/api/add-history")
    public ResponseEntity<History> addUser(@RequestBody History history) {
        return new ResponseEntity<>(historyService.addHistory(history), HttpStatus.CREATED);
    }

    public List<History> setQuizTitle(List<History> histories) {
        List<String> quizIds = histories.stream()
                .map(History::getQuizId)
                .collect(Collectors.toList());
        List<Quiz> quizzes = quizService.getAllByQuiz(quizIds);
        IntStream.range(0, histories.size())
                .forEach(i -> histories.get(i).setQuizId(quizzes.stream()
                        .filter(quiz -> quiz.getId().equals(histories.get(i).getQuizId()))
                        .map(Quiz::getTitle)
                        .findFirst()
                        .orElse(null)));
        return histories;
    }

    public List<History> setUser(List<History> histories) {
        List<String> usernames = histories.stream()
                .map(History::getUserName)
                .collect(Collectors.toList());
        List<User> users = userService.getAllByUsernames(usernames);
        IntStream.range(0, histories.size())
                .forEach(i -> histories.get(i).setUserName(users.stream()
                        .filter(user-> user.getUserName().equals(histories.get(i).getUserName()))
                        .map(User::getFullName)
                        .findFirst()
                        .orElse(null)));
        return histories;
    }
}
