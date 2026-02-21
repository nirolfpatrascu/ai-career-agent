import { NextRequest, NextResponse } from 'next/server';
import ReactPDF from '@react-pdf/renderer';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import React from 'react';

// Register Helvetica (built-in, no need to load)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#1a1a1a',
    lineHeight: 1.4,
  },
  name: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  contact: {
    fontSize: 9,
    color: '#555',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 3,
    marginBottom: 8,
    marginTop: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  text: {
    fontSize: 10,
    marginBottom: 4,
    lineHeight: 1.5,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    marginTop: 6,
  },
  jobTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  jobDate: {
    fontSize: 9,
    color: '#666',
  },
  jobCompany: {
    fontSize: 10,
    color: '#444',
    marginBottom: 3,
  },
  bullet: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 8,
  },
  bulletDot: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.4,
  },
  eduRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  eduDegree: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  eduYear: {
    fontSize: 9,
    color: '#666',
  },
  eduInstitution: {
    fontSize: 9.5,
    color: '#444',
    marginBottom: 4,
  },
});

interface CVData {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills?: string;
  experience?: { title: string; company: string; dateRange: string; description: string }[];
  education?: { degree: string; institution: string; year: string }[];
  certifications?: string;
  languages?: string;
  targetRole?: string;
}

function buildCVDocument(data: CVData) {
  return React.createElement(Document, null,
    React.createElement(Page, { size: 'A4', style: styles.page },
      // Name
      data.name ? React.createElement(Text, { style: styles.name }, data.name) : null,

      // Contact
      (data.email || data.phone) ? React.createElement(Text, { style: styles.contact },
        [data.email, data.phone].filter(Boolean).join(' | ')
      ) : null,

      // Summary
      data.summary ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'PROFESSIONAL SUMMARY'),
        React.createElement(Text, { style: styles.text }, data.summary)
      ) : null,

      // Skills
      data.skills ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'SKILLS'),
        React.createElement(Text, { style: styles.text }, data.skills)
      ) : null,

      // Experience
      data.experience && data.experience.length > 0 ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'EXPERIENCE'),
        ...data.experience.map((exp, i) =>
          React.createElement(View, { key: i },
            React.createElement(View, { style: styles.jobHeader },
              React.createElement(Text, { style: styles.jobTitle }, exp.title),
              React.createElement(Text, { style: styles.jobDate }, exp.dateRange)
            ),
            React.createElement(Text, { style: styles.jobCompany }, exp.company),
            ...exp.description.split('\n').filter(Boolean).map((line, j) =>
              React.createElement(View, { style: styles.bullet, key: j },
                React.createElement(Text, { style: styles.bulletDot }, '\u2022'),
                React.createElement(Text, { style: styles.bulletText }, line.replace(/^[•\-]\s*/, ''))
              )
            )
          )
        )
      ) : null,

      // Education
      data.education && data.education.length > 0 ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'EDUCATION'),
        ...data.education.map((edu, i) =>
          React.createElement(View, { key: i },
            React.createElement(View, { style: styles.eduRow },
              React.createElement(Text, { style: styles.eduDegree }, edu.degree),
              React.createElement(Text, { style: styles.eduYear }, edu.year)
            ),
            React.createElement(Text, { style: styles.eduInstitution }, edu.institution)
          )
        )
      ) : null,

      // Certifications
      data.certifications ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'CERTIFICATIONS'),
        React.createElement(Text, { style: styles.text }, data.certifications)
      ) : null,

      // Languages
      data.languages ? React.createElement(View, null,
        React.createElement(Text, { style: styles.sectionTitle }, 'LANGUAGES'),
        React.createElement(Text, { style: styles.text }, data.languages)
      ) : null
    )
  );
}

export async function POST(req: NextRequest) {
  try {
    const data: CVData = await req.json();
    const doc = buildCVDocument(data);
    const pdfStream = await ReactPDF.renderToStream(doc);

    // Collect the stream into a buffer
    const chunks: Buffer[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    const pdfBuffer = Buffer.concat(chunks);

    const safeName = (data.name || 'CV').replace(/[^a-zA-Z0-9]/g, '_');
    const safeRole = (data.targetRole || 'Role').replace(/[^a-zA-Z0-9]/g, '_');
    const date = new Date().toISOString().split('T')[0];
    const filename = `${safeName}_CV_${safeRole}_${date}.pdf`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
