import { StandardDateFormatter } from '@modules/date-formatter'


describe('StandardDateFormatter is instantiated with default options', () => {


  const dateFormatter = new StandardDateFormatter()


  it('formatDate should not throw', () => {
    expect(() => dateFormatter.formatDate()).not.toThrow()
  })

  it('formatTime should not throw', () => {
    expect(() => dateFormatter.formatTime()).not.toThrow()
  })

  it('formatDateTime should not throw', () => {
    expect(() => dateFormatter.formatDateTime()).not.toThrow()
  })


  it('getLocaleDate should not throw', () => {
    expect(() => dateFormatter.getLocaleDate()).not.toThrow()
  })

  it('getLocaleTime should not throw', () => {
    expect(() => dateFormatter.getLocaleTime()).not.toThrow()
  })

  it('getLocaleDateTime should not throw', () => {
    expect(() => dateFormatter.getLocaleDateTime()).not.toThrow()
  })
})
