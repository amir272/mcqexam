package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.History;
import com.nodedjava.exam.repo.HistoryRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HistoryServiceIMPL implements HistoryService{

    @Autowired
    HistoryRepo historyRepo;

    @Override
    public History addHistory(History history) {
        return historyRepo.save(history);
    }

    @Override
    public List<History> getHistories() {
        return historyRepo.findAll();
    }

    @Override
    public List<History> getHistoryByUser(String username) {
        return historyRepo.findByHistory(username);
    }

    @Override
    public List<History> getHistoryByShift(String shift) {
        return historyRepo.findByShift(shift);
    }
}
