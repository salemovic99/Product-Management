import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet
} from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
  },
  
  // Header - simple title
  header: {
    textAlign: 'center',
    marginBottom: 30,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  // Employee info section
  employeeSection: {
    marginBottom: 25,
  },
  
  employeeRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  
  employeeLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 80,
  },
  
  employeeValue: {
    fontSize: 12,
    flex: 1,
    borderBottom: '1pt solid #000000',
    paddingBottom: 2,
    marginLeft: 5,
  },
  
  // Table section
  tableSection: {
    marginBottom: 25,
  },
  
  tableHeader: {
    flexDirection: 'row',
    borderTop: '2pt solid #000000',
    borderLeft: '2pt solid #000000',
    borderRight: '2pt solid #000000',
    borderBottom: '1pt solid #000000',
  },
  
  tableHeaderCell: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
    borderRight: '1pt solid #000000',
  },
  
  tableHeaderCellLast: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 8,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderLeft: '2pt solid #000000',
    borderRight: '2pt solid #000000',
    borderBottom: '1pt solid #000000',
    minHeight: 25,
  },
  
  tableCell: {
    fontSize: 10,
    padding: 6,
    borderRight: '1pt solid #000000',
    textAlign: 'center',
  },
  
  tableCellLast: {
    fontSize: 10,
    padding: 6,
    textAlign: 'center',
  },
  
  // Column widths
  colNumber: {
    width: '8%',
  },
  
  colDescription: {
    width: '35%',
  },
  
  colQuantity: {
    width: '12%',
  },
  
  colValue: {
    width: '12%',
  },
  
  colCondition: {
    width: '15%',
  },
  
  colNotes: {
    width: '18%',
  },
  
  // Declaration section
  declarationSection: {
    marginTop: 20,
    marginBottom: 25,
  },
  
  declarationText: {
    fontSize: 11,
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  
  // Signature section
  signatureSection: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  signatureBox: {
    width: '45%',
  },
  
  signatureField: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  
  signatureLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    width: 80,
  },
  
  signatureLine: {
    flex: 1,
    borderBottom: '1pt solid #000000',
    height: 15,
    marginLeft: 5,
  },
  
  signaturePrefilledName: {
    fontSize: 11,
    paddingTop: 2,
    marginLeft: 5,
  },
});

export const DeliveryPDF = ({ data = {} }) => {
 
  const employee = data.employee || {};
  const location = data.location || {};
  
  const getConditionText = (inWarehouse) => {
    return inWarehouse ? 'In Warehouse' : 'New';
  };
  
  
  const assetDescription = data.name ? 
    `${data.name}\n(${data.serial_number || data.our_serial_number ||  'N/A'})` : 
    'Asset Name Not Specified';
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Asset Handover Form</Text>
        </View>
        
        {/* Employee Information */}
        <View style={styles.employeeSection}>
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Name:</Text>
            <Text style={styles.employeeValue}>{employee.name || ''}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Job Title:</Text>
            <Text style={styles.employeeValue}>{employee.position?.name || "Not Specified"}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Location:</Text>
            <Text style={styles.employeeValue}>{location.name || ''}</Text>
          </View>
          
          <View style={styles.employeeRow}>
            <Text style={styles.employeeLabel}>Employee ID:</Text>
            <Text style={styles.employeeValue}>{employee.employee_id || ''}</Text>
          </View>
        </View>
        
        {/* Table */}
        <View style={styles.tableSection}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, styles.colNumber]}>No.</Text>
            <Text style={[styles.tableHeaderCell, styles.colDescription]}>Asset Description</Text>
            <Text style={[styles.tableHeaderCell, styles.colQuantity]}>Quantity</Text>
            <Text style={[styles.tableHeaderCell, styles.colValue]}>Value</Text>
            <Text style={[styles.tableHeaderCell, styles.colCondition]}>Status</Text>
            <Text style={[styles.tableHeaderCellLast, styles.colNotes]}>Notes</Text>
          </View>
          
          {/* First Row with Data */}
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colNumber]}>1</Text>
            <Text style={[styles.tableCell, styles.colDescription]}>{assetDescription}</Text>
            <Text style={[styles.tableCell, styles.colQuantity]}>1</Text>
            <Text style={[styles.tableCell, styles.colValue]}>-</Text>
            <Text style={[styles.tableCell, styles.colCondition]}>{getConditionText(data.in_warehouse)}</Text>
            <Text style={[styles.tableCellLast, styles.colNotes]}>
              {data.note}
            </Text>
          </View>
          
          {/* Empty Rows */}
          {[2].map(num => (
            <View key={num} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colNumber]}>{num}</Text>
              <Text style={[styles.tableCell, styles.colDescription]}></Text>
              <Text style={[styles.tableCell, styles.colQuantity]}></Text>
              <Text style={[styles.tableCell, styles.colValue]}></Text>
              <Text style={[styles.tableCell, styles.colCondition]}></Text>
              <Text style={[styles.tableCellLast, styles.colNotes]}></Text>
            </View>
          ))}
        </View>
        
        {/* Declaration */}
        <View style={styles.declarationSection}>
          <Text style={styles.declarationText}>
            I, the undersigned, acknowledge that I have received the assets listed above, and I undertake to maintain them and return them to the institution upon request. I also undertake not to use the devices mentioned above outside the scope of work or any illegal use.
          </Text>
        </View>
        
        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature:</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Received By</Text>
            </View>
            
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name:</Text>
              <Text style={styles.signaturePrefilledName}>{employee.name || ''}</Text>
            </View>
            
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Date:</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
          
          <View style={styles.signatureBox}>
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Signature:</Text>
              <View style={styles.signatureLine} />
              <Text style={styles.signatureLabel}>Delivered By</Text>
            </View>
            
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Name:</Text>
              <View style={styles.signatureLine} />
            </View>
            
            <View style={styles.signatureField}>
              <Text style={styles.signatureLabel}>Date:</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>
        
      </Page>
    </Document>
  );
};