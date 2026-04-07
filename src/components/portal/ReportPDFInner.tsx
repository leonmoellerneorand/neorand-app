// src/components/portal/ReportPDFInner.tsx
// This file is ONLY ever loaded client-side (via dynamic import with ssr:false)
import { useState } from 'react'
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import { Button } from '@/components/ui/Button'
import { Download } from 'lucide-react'
import type { ReportData } from './ReportPDF'

const styles = StyleSheet.create({
  page: { padding: 40, backgroundColor: '#ffffff', fontFamily: 'Helvetica' },
  header: { marginBottom: 24, borderBottomWidth: 2, borderBottomColor: '#3b82f6', paddingBottom: 16 },
  logo: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: '#3b82f6', letterSpacing: 4 },
  subtitle: { fontSize: 10, color: '#94a3b8', marginTop: 4 },
  section: { marginBottom: 20 },
  label: { fontSize: 8, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  value: { fontSize: 13, color: '#0f172a', fontFamily: 'Helvetica-Bold' },
  table: { marginTop: 8 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 8 },
  tableHeader: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: '#e2e8f0', paddingVertical: 6 },
  col1: { flex: 2, fontSize: 10, color: '#0f172a' },
  col2: { flex: 1, fontSize: 10, color: '#0f172a', textAlign: 'center' },
  headerText: { fontSize: 8, color: '#94a3b8', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', letterSpacing: 1 },
  footer: { position: 'absolute', bottom: 30, left: 40, right: 40, fontSize: 8, color: '#cbd5e1', textAlign: 'center' },
  row: { flexDirection: 'row', gap: 40, marginBottom: 24 },
})

function ReportDocument({ data }: { data: ReportData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.logo}>NEORAND</Text>
          <Text style={styles.subtitle}>Portal de Clientes · Reporte Mensual</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.section}>
            <Text style={styles.label}>Cliente</Text>
            <Text style={styles.value}>{data.contactName}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Empresa</Text>
            <Text style={styles.value}>{data.company}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Solución</Text>
            <Text style={styles.value}>{data.solutionName}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Período</Text>
            <Text style={styles.value}>{data.month}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <Text style={[styles.label, { marginBottom: 8 }]}>Métricas de actividad</Text>
          <View style={styles.tableHeader}>
            <Text style={[styles.col1, styles.headerText]}>Métrica</Text>
            <Text style={[styles.col2, styles.headerText]}>Total</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Total de ejecuciones</Text>
            <Text style={styles.col2}>{data.total}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Exitosas</Text>
            <Text style={styles.col2}>{data.success}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Con errores</Text>
            <Text style={styles.col2}>{data.error}</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.col1}>Informativas</Text>
            <Text style={styles.col2}>{data.info}</Text>
          </View>
        </View>
        <Text style={styles.footer}>
          Generado el {data.generatedDate} · NEORAND Portal de Clientes
        </Text>
      </Page>
    </Document>
  )
}

export function DownloadReportButtonInner({ data }: { data: ReportData }) {
  const [ready, setReady] = useState(false)

  if (!ready) {
    return (
      <Button variant="secondary" size="sm" onClick={() => setReady(true)}>
        <Download size={13} />Descargar PDF
      </Button>
    )
  }

  return (
    <PDFDownloadLink
      document={<ReportDocument data={data} />}
      fileName={`neorand-reporte-${data.month.toLowerCase().replace(/\s/g, '-')}.pdf`}
    >
      {({ loading }) => (
        <Button variant="secondary" size="sm" loading={loading}>
          <Download size={13} />
          {loading ? 'Generando...' : 'Descargar PDF'}
        </Button>
      )}
    </PDFDownloadLink>
  )
}
