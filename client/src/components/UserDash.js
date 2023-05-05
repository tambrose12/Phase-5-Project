import React, { useContext, useState } from "react";
import { UserContext } from "./context/user";
import { Navigate } from "react-router-dom";
import Charts from "./Charts";
import TempDrawer from "./TempDrawer";
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { TableContainer, Table, TableBody, TableRow, TableHead, TableCell } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Modal from "react-modal";
import { Button } from "@mui/material";
import { StatsContext } from './context/stats';


const UserDash = ({ removeStat }) => {
	const { user, setUser } = useContext(UserContext)
	const { stats, setStats } = useContext(StatsContext)
	const [modalOpen, setModalOpen] = useState(false);
	const [thisStat, setThisStat] = useState('')
	const [anAmount, setAnAmount] = useState('')

	console.log(thisStat)

	let habitStats = user.habitstats

	const removeStatfromState = (deleteStatId) => {
		setStats(stats => stats.filter(stat => {
			return stat.id != deleteStatId
		}))
	}

	const handleDelete = (id) => {
		fetch(`/stats/${id}`, {
			method: 'DELETE',
			headers: { 'Content-Type': 'application/json' },
		})
			.then(r => r.json)
			.then(removeStatfromState(id))
		const updatedHabitStats = habitStats.filter((stat) => {
			return stat.id != id
		})
		setUser({ ...user, habitstats: updatedHabitStats })
		window.alert("Habit removed from list")

	}

	// let habitNames = habitStats.map(s => s.habit.name)

	const uniqueStats = [...new Map(habitStats.map((h) => [h.name, h])).values()];


	const handleModalOpen = (aStat) => {
		setModalOpen(true)
		setThisStat(aStat)
	}

	const handleChange = e => {
		const { name, value } = e.target
		setThisStat(thisStat => ({ ...thisStat, [name]: value }))
	}

	const handleSubmit = e => {
		e.preventDefault()

		const newStat = {
			amount: parseInt(thisStat.amount),
			user_id: user.id,
			habit_id: thisStat.habit.id
		}

		fetch(`/stats/${thisStat.id}`, {
			method: 'PATCH',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(newStat)
		})
			.then(r => r.json())
			.then(updatedStat => {
				setThisStat(updatedStat)
				const updatedHabitStats = habitStats.map((stat) => {
					if (stat.id === thisStat.id) {
						return updatedStat
					} else {
						return stat
					}
				})
				setUser({ ...user, habitstats: updatedHabitStats })
			})
		window.alert("Progress Updated")


	}

	const tableRows = habitStats.map((stat) => {

		return (
			<TableRow key={stat.id} sx={{ maxWidth: 800 }} size="small" aria-label="a dense table">
				<TableCell><button onClick={() => handleDelete(stat.id)} className='deleteBtn'><DeleteIcon fontSize="small" /></button></TableCell>
				<TableCell>{stat.habit.name}</TableCell>
				<TableCell align="right">{stat.habit.category}</TableCell>
				<TableCell align="right">{stat.habit.goal} </TableCell>
				<TableCell align="right" value={stat.amount}>{stat.amount} <button className='addBtn' onClick={() => handleModalOpen(stat)}><AddIcon /></button></TableCell>
			</TableRow>
		)
	})


	if (habitStats === null) {
		return (
			<div>
				<h2>Hello, {user.username}!</h2>
				<img className="userImage" src={user.image} alt={user.username} />
				<h3>Check out the menu and start adding some Habit Goals to your list!</h3>
			</div>
		)
	} else if (habitStats === []) {
		return (
			<div>
				<h2>Hello, {user.username}!</h2>
				<img className="userImage" src={user.image} alt={user.username} />
				<h3>Check out the menu and start adding some Habit Goals to your list!</h3>
			</div>
		)
	} else {
		return (
			<div>
				<TempDrawer />
				<h2>Hello, {user.username}!</h2>
				<img className="userImage" src={user.image} alt={user.username} />
				<p>Welcome to your Dashboard!</p>
				<p>Click the Menu to find the option to add habits to your list of goals.</p>
				<h3>Your Habit Goals:</h3>
				<br />
				<TableContainer>
					<Table sx={{ maxWidth: 800 }} size="small" aria-label="a dense table">
						<TableHead>
							<TableRow>
								<TableCell sx={{ maxWidth: 10 }}> </TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} >Habit</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} align="right">Category</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} align="right">Goal</TableCell>
								<TableCell sx={{ fontWeight: 'bold' }} align="right">Progress</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{tableRows}
						</TableBody>
					</Table>
				</TableContainer>
				<br />
				<Modal
					ariaHideApp={false}
					isOpen={modalOpen}
					onRequestClose={() => setModalOpen(false)}
				>
					<div className='Login'>
						{/* onSubmit={addProgress} */}
						<form onSubmit={handleSubmit}>
							<label for="amount"> Enter Progress: </label>
							<br />
							<input onChange={handleChange} type="number" name="amount" min="number" value={thisStat.amount} />
							<br />
							<Button variant='outlined' sx={{ marginTop: 2 }} type="submit">Submit Progress</Button>
						</form>
						<br />
						<Button variant='outlined' sx={{ marginTop: 10 }} onClick={() => setModalOpen(false)} >
							Close Form
						</Button>
					</div>
				</Modal>


			</div>
		);
	}


}

export default UserDash;