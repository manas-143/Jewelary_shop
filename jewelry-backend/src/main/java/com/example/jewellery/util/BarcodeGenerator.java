package com.example.jewellery.util;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.nio.file.Paths;

@Component
public class BarcodeGenerator {

    public void generateBarcode(String text, String outputPath) throws Exception {

        int width = 350;
        int height = 120;

        BitMatrix matrix = new MultiFormatWriter()
                .encode(text, BarcodeFormat.CODE_128, width, height);

        Path path = Paths.get(outputPath);
        MatrixToImageWriter.writeToPath(matrix, "png", path);
    }
}
