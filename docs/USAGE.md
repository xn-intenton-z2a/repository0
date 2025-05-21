# CLI Usage

The `repository0` CLI supports displaying emotions as ASCII art and plotting equations.

## Emotion Display

```bash
npm run start -- --emotion <name>
```

Supported emotions:

- happy
- sad
- angry
- surprised

For more details, see [features/DISPLAY_EMOTION.md](../features/DISPLAY_EMOTION.md).

## Plotting Equations

### Console Mode

```bash
npm run start -- --plot "<equation>"
```

By default, the CLI samples 80 points over the range -10 to 10 and renders a grid of 20 rows. Data points are marked with `*`.

**Example:**

```bash
npm run start -- --plot "x^2 - 2*x + 1"
```

_Output (example):_

```
                                     *                                           
                                    * *                                          
                                   *   *                                         
                                  *     *                                        
                                 *       *                                       
                                *         *                                      
                               *           *                                     
                              *             *                                    
                             *               *                                   
                            *                 *                                  
                           *                   *                                 
                          *                     *                                
                         *                       *                               
                        *                         *                              
                       *                           *                             
                      *                             *                            
                     *                               *                           
                    *                                 *                          
                   *                                   *                         
                  *                                     *                        
```  

- **Default Range:** -10 to 10  
- **Grid Size:** 20 rows, 80 columns
