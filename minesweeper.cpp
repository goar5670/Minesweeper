#include<bits/stdc++.h>

using namespace std;


int di[] = {0, 0, -1, -1, -1, 1, 1, 1};
int dj[] = {-1, 1, -1, 0, 1, -1, 0, 1};

bool inbounds(int x, int y, int height, int width)
{
	if(x < 0 || x >= height || y < 0 || y >= width)
		return 0;
	return 1;
}

vector<vector<int>> generateGrid(int height, int width, int number_of_mines)
{
	vector<vector<int>> grid;
	grid.resize(height);
	for(int i=0; i<height; i++)
		grid[i] = vector<int>(width, 0);
	int cnt = 0;
	while(cnt < number_of_mines)
	{
		int x = rand()%height;
		int y = rand()%width;
		cout << x << " " << y << " " << grid[x][y] << endl;
		if(grid[x][y] != -1)
		{
			grid[x][y] = -1;
			cnt++;
			for(int k=0; k<8; k++)
			{
				int nx = x+di[k];
				int ny = y+dj[k];
				if(inbounds(nx, ny, height, width) && grid[nx][ny] != -1)
					grid[nx][ny]++;
			}
		}
	}
	return grid;
}

void solveManually(vector<vector<int>> grid)
{
	
}

int main()
{
	srand(time(NULL));	
	cout << "Enter height and width of the grid: ";
	int height, width, number_of_mines;
	cin >> height >> width;
	cout << "Enter number of mines: ";
	cin >> number_of_mines;
	auto grid = generateGrid(height, width, number_of_mines);
	cout << "******GRID GENERATED******" << endl;
	for(int i=0; i<width; i++)
	{
		for(int j=0; j<height; j++)
			cout << grid[i][j] << " ";
		cout << endl;	
	}
}