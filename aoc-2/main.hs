import Data.Map (Map)
import qualified Data.Map as Map


charCounts :: String -> Map Char Int
charCounts (x:xs) = Map.insertWith (+) x 1 (charCounts xs)
charCounts []     = Map.empty

processId :: [(Char, Int)] -> (Bool, Bool)
processId xs = foldr f (False, False) m
               where m :: [(Bool, Bool)]
                     m = map (\(c, i) -> (i == 2, i == 3)) xs

                     f :: (Bool, Bool) -> (Bool, Bool) -> (Bool, Bool)
                     f (a1, a2) (b1, b2) = (a1 || b1, a2 || b2)

collect :: [(Bool, Bool)] -> (Int, Int)
collect xs = foldr f (0, 0) xs
             where f :: (Bool, Bool) -> (Int, Int) -> (Int, Int)
                   f (a1, a2) (b1, b2)
                       | a1 && a2  = (b1 + 1, b2 + 1)
                       | a1        = (b1 + 1, b2)
                       | a2        = (b1, b2 + 1)
                       | otherwise = (b1, b2)

calculateChecksum :: [String] -> Int
calculateChecksum input = a * b
                          where (a, b) = collect [ (processId . Map.toList . charCounts) s | s <- input ]

sameChars :: String -> String -> Int
sameChars (x:xs) (y:ys) 
                | x == y    = 1 + sameChars xs ys
                | otherwise = sameChars xs ys
sameChars [] [] = 0

getCorrectBoxes :: [String] -> [String]
getCorrectBoxes xs = [ x | x <- xs, y <- xs, (length x - (sameChars x y)) == 1 ]

removeDiffChars :: [String] -> String
removeDiffChars xs = foldr f (last xs) xs
                     where f :: String -> String -> String
                           f (x:xs) (y:ys)
                               | x == y    = x:(f xs ys)
                               | otherwise = f xs ys
                           f [] [] = []

main = do
    input <- readFile "inputs.txt"
    putStrLn ("[Part 1] Checksum: " ++ (show . calculateChecksum) (lines input))
    putStrLn ("[Part 2] ID: " ++ (removeDiffChars . getCorrectBoxes) (lines input))