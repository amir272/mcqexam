package com.nodedjava.exam.service;

import com.nodedjava.exam.entity.Batch;
import com.nodedjava.exam.repo.BatchRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BatchServiceIMPL implements BatchService{

    @Autowired
    BatchRepo batchRepo;

    @Override
    public void addBatch(Batch batch) {
        batchRepo.save(batch);
    }
}
