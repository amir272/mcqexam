package com.nodedjava.exam;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
class ExamApplicationTests {

	@Test
	void contextLoads() {
	}

	@Test
	public void testUnicodeExtraction() {
		String testText = "∑(x²) = ∫ √x dx + π";
		System.out.println("Original: " + testText);
		byte[] bytes = testText.getBytes(StandardCharsets.UTF_8);
		String decoded = new String(bytes, StandardCharsets.UTF_8);
		System.out.println("Decoded: " + decoded);
		assertEquals(testText, decoded);
	}

}
