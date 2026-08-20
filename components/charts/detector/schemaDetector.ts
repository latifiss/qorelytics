import { ChartDataPoint, Field, DataSchema, PropertyType } from '@/components/charts/types/chart.types';

export class SchemaDetector {
  detect(data: ChartDataPoint[]): DataSchema {
    if (!data || data.length === 0) {
      return { fields: [], dimensions: [], measures: [], timeFields: [], geographicFields: [], rowCount: 0, columnCount: 0, hasTimeSeries: false, hasNumericData: false, hasCategoricalData: false };
    }

    const sample = data[0];
    const fields: Field[] = [];
    const dimensions: string[] = [];
    const measures: string[] = [];
    const timeFields: string[] = [];
    const geographicFields: string[] = [];

    Object.keys(sample).forEach((key) => {
      const values = data.map((row) => row[key]);
      const uniqueValues = new Set(values);
      const nullCount = values.filter((v) => v === null || v === undefined || v === '').length;
      const type = this.detectType(values);
      const isNumeric = ['number', 'integer', 'decimal', 'percentage', 'currency'].includes(type);
      const isCategorical = ['string', 'category', 'enum'].includes(type);
      const isTime = ['date', 'datetime', 'time'].includes(type);
      const isGeo = ['geographic', 'latitude', 'longitude'].includes(type);

      const field: Field = {
        name: key,
        type: type,
        sample: values.find((v) => v !== null && v !== undefined) || '',
        uniqueCount: uniqueValues.size,
        nullCount: nullCount,
      };

      if (isNumeric) {
        const numericValues = values.filter((v) => typeof v === 'number' && !isNaN(v));
        if (numericValues.length > 0) {
          field.min = Math.min(...numericValues);
          field.max = Math.max(...numericValues);
          field.mean = numericValues.reduce((a, b) => a + b, 0) / numericValues.length;
        }
        measures.push(key);
      } else if (isCategorical) {
        dimensions.push(key);
      } else if (isTime) {
        timeFields.push(key);
        dimensions.push(key);
      } else if (isGeo) {
        geographicFields.push(key);
        dimensions.push(key);
      } else {
        dimensions.push(key);
      }

      fields.push(field);
    });

    return {
      fields,
      dimensions,
      measures,
      timeFields,
      geographicFields,
      rowCount: data.length,
      columnCount: fields.length,
      hasTimeSeries: timeFields.length > 0,
      hasNumericData: measures.length > 0,
      hasCategoricalData: dimensions.length > 0,
    };
  }

  private detectType(values: any[]): PropertyType {
    const nonNullValues = values.filter((v) => v !== null && v !== undefined && v !== '');
    if (nonNullValues.length === 0) return 'null';

    const sample = nonNullValues[0];
    
    // Check if all values are numbers
    const allNumbers = nonNullValues.every((v) => typeof v === 'number' && !isNaN(v));
    if (allNumbers) {
      const hasDecimals = nonNullValues.some((v) => v % 1 !== 0);
      const allPositive = nonNullValues.every((v) => v >= 0);
      const maxVal = Math.max(...nonNullValues);
      const minVal = Math.min(...nonNullValues);
      
      if (allPositive && maxVal <= 1 && minVal >= 0) return 'percentage';
      if (maxVal > 1000000) return 'currency';
      if (hasDecimals) return 'decimal';
      return 'integer';
    }

    // Check if all values are dates
    const allDates = nonNullValues.every((v) => !isNaN(Date.parse(String(v))));
    if (allDates) {
      const hasTime = nonNullValues.some((v) => String(v).includes(':'));
      return hasTime ? 'datetime' : 'date';
    }

    // Check if boolean
    const allBooleans = nonNullValues.every((v) => typeof v === 'boolean' || v === 'true' || v === 'false');
    if (allBooleans) return 'boolean';

    // Check if geographic
    if (this.isGeographic(nonNullValues)) return 'geographic';

    // Default to string
    return 'string';
  }

  private isGeographic(values: string[]): boolean {
    // Simple check - could be more sophisticated
    const geoKeywords = ['country', 'city', 'region', 'state', 'province', 'postal', 'zip', 'latitude', 'longitude'];
    const sample = String(values[0] || '').toLowerCase();
    return geoKeywords.some((keyword) => sample.includes(keyword));
  }
}