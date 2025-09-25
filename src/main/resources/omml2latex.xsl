<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:m="http://schemas.openxmlformats.org/officeDocument/2006/math"
                xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
                exclude-result-prefixes="m w" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                xsi:schemaLocation="http://schemas.openxmlformats.org/officeDocument/2006/math ">

    <xsl:output method="text" encoding="UTF-8"/>

    <xsl:template match="m:oMathPara | m:oMath">
        <xsl:apply-templates/>
    </xsl:template>

    <!-- Function (e.g., sin, cos) -->
    <xsl:template match="m:f">
        <xsl:apply-templates select="m:fName"/>
        <xsl:text>(</xsl:text>
        <xsl:apply-templates select="m:e"/>
        <xsl:text>)</xsl:text>
    </xsl:template>

    <!-- Fraction -->
    <xsl:template match="m:d">
        <xsl:text>\frac{</xsl:text>
        <xsl:apply-templates select="m:num/m:e"/>
        <xsl:text>}{</xsl:text>
        <xsl:apply-templates select="m:den/m:e"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- Radical (Square Root) -->
    <xsl:template match="m:rad">
        <xsl:text>\sqrt{</xsl:text>
        <xsl:apply-templates select="m:e"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- Subscript -->
    <xsl:template match="m:sSub">
        <xsl:text>{</xsl:text>
        <xsl:apply-templates select="m:e"/>
        <xsl:text>}_{</xsl:text>
        <xsl:apply-templates select="m:sub"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- Superscript -->
    <xsl:template match="m:sSup">
        <xsl:text>{</xsl:text>
        <xsl:apply-templates select="m:e"/>
        <xsl:text>}^{</xsl:text>
        <xsl:apply-templates select="m:sup"/>
        <xsl:text>}</xsl:text>
    </xsl:template>

    <!-- Text runs -->
    <xsl:template match="m:r">
        <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="m:t">
        <xsl:value-of select="."/>
    </xsl:template>

    <!-- Default catch-all for other elements -->
    <xsl:template match="*">
        <xsl:apply-templates/>
    </xsl:template>

</xsl:stylesheet>