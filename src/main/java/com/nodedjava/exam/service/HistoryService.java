package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.History;

import java.util.List;

public interface HistoryService {
    History addHistory(History history);

    List<History> getHistories();

    List<History> getHistoryByUser(String username);

    List<History> getHistoryByShift(String shift);
}
